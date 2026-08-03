import React, { useRef, useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Editor, { type OnMount } from '@monaco-editor/react';
import { X, FileCode, Upload, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  createNcProgramSchema,
  addVersionSchema,
  createNcProgramFromEditorSchema,
  addVersionFromEditorSchema,
  type CreateNcProgramFormData,
  type CreateNcProgramFromEditorFormData,
} from '../validators/ncProgramValidator';
import {
  handleEditorWillMount,
  validateGcode,
  formatGcode as formatGcodeHelper,
  GCODE_LANGUAGE_ID,
  type MonacoEditorModel,
  type MonacoInstance,
} from '../lib/gcodeMonaco';

type StandaloneCodeEditor = Parameters<OnMount>[0];
type Monaco = Parameters<OnMount>[1];

interface NcEditorModalProps {
  mode: 'create' | 'addVersion';
  programName?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmitFile: (formData: FormData) => void;
  onSubmitEditor: (
    content: string,
    description?: string,
    name?: string,
  ) => void;
  loadPreviousContent?: () => Promise<string>;
}

const NcEditorModal: React.FC<NcEditorModalProps> = ({
  mode,
  programName,
  loading = false,
  onClose,
  onSubmitFile,
  onSubmitEditor,
  loadPreviousContent,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'editor'>('upload');
  const [ncFile, setNcFile] = useState<File | null>(null);
  const [editorContent, setEditorContent] = useState<string>(
    '// Start typing your G-code here...\nO1000\nG17 G21 G90\nG0 X0 Y0 Z10\nM30\n',
  );
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editorRef = useRef<StandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Setup form states for each schema validation path
  const fileForm = useForm<CreateNcProgramFormData>({
    resolver: zodResolver(
      mode === 'create' ? createNcProgramSchema : addVersionSchema,
    ) as unknown as Resolver<CreateNcProgramFormData>,
    defaultValues: { name: '', description: '' },
  });

  const editorForm = useForm<CreateNcProgramFromEditorFormData>({
    resolver: zodResolver(
      mode === 'create'
        ? createNcProgramFromEditorSchema
        : addVersionFromEditorSchema,
    ) as unknown as Resolver<CreateNcProgramFromEditorFormData>,
    defaultValues: { name: '', content: editorContent, description: '' },
  });

  useEffect(() => {
    if (activeTab === 'editor') {
      editorForm.setValue('content', editorContent);
    }
  }, [editorContent, activeTab, editorForm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNcFile(file);
    fileForm.setValue('file', file as File, { shouldValidate: true });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    const model = editor.getModel();
    if (model) {
      validateGcode(
        monaco as unknown as MonacoInstance,
        model as unknown as MonacoEditorModel,
      );
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const textVal = value ?? '';
    setEditorContent(textVal);
    editorForm.setValue('content', textVal, { shouldValidate: true });

    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        validateGcode(
          monacoRef.current as unknown as MonacoInstance,
          model as unknown as MonacoEditorModel,
        );
      }
    }
  };

  const formatCode = () => {
    if (!editorRef.current) return;
    const formatted = formatGcodeHelper(editorContent);
    editorRef.current.setValue(formatted);
    setEditorContent(formatted);
    editorForm.setValue('content', formatted, { shouldValidate: true });
  };

  const clearCode = () => {
    if (!editorRef.current) return;
    const template = '; New NC Program\n';
    editorRef.current.setValue(template);
    setEditorContent(template);
    editorForm.setValue('content', template, { shouldValidate: true });
  };

  const loadPrevious = async () => {
    if (!loadPreviousContent) return;
    setLoadingContent(true);
    try {
      const prevContent = await loadPreviousContent();
      if (editorRef.current) {
        editorRef.current.setValue(prevContent);
      }
      setEditorContent(prevContent);
      editorForm.setValue('content', prevContent, { shouldValidate: true });
    } catch (err) {
      console.error('Failed to load previous content:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleFileSubmit = (data: CreateNcProgramFormData) => {
    const formData = new FormData();
    if (mode === 'create') {
      formData.append('name', data.name);
    }
    formData.append('ncFile', data.file);
    if (data.description) {
      formData.append('description', data.description);
    }
    onSubmitFile(formData);
  };

  const handleEditorSubmit = (data: CreateNcProgramFromEditorFormData) => {
    onSubmitEditor(
      data.content,
      data.description,
      mode === 'create' ? data.name : undefined,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#3B2E8C]  text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {mode === 'create'
                ? 'Add New NC Program'
                : `Add New Version for ${programName || ''}`}
            </h2>
            <p className="text-indigo-200 text-xs mt-0.5">
              Select program upload method or edit inline
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 px-6 py-2 bg-gray-50/70 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
            }`}
          >
            <Upload size={16} />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'editor'
                ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
            }`}
          >
            <FileCode size={16} />
            Program Editor
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'upload' ? (
            <form
              id="nc-file-form"
              onSubmit={fileForm.handleSubmit(handleFileSubmit)}
              className="space-y-4"
            >
              {/* Program Name */}
              {mode === 'create' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Program Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...fileForm.register('name')}
                    placeholder="e.g. Fan Cover Base"
                  />
                  {fileForm.formState.errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {fileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
              )}

              {/* File Dropzone */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">
                  NC Program File <span className="text-red-500">*</span>
                </label>

                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50/50 ${
                    ncFile
                      ? 'border-green-400 bg-green-50/10'
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <div
                    className={`p-3 rounded-full mb-3 ${ncFile ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}
                  >
                    {ncFile ? <FileCode size={24} /> : <Upload size={24} />}
                  </div>

                  {ncFile ? (
                    <div className="text-center">
                      <span className="font-semibold text-gray-800 block text-sm max-w-md truncate">
                        {ncFile.name}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 block">
                        {(ncFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="font-semibold text-gray-800 block text-sm">
                        Click to select NC file
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 block">
                        Allowed: .nc, .cnc, .tap, .ngc, .txt, .mpf, .ptp (Max
                        10MB)
                      </span>
                    </div>
                  )}

                  <input
                    ref={fileRef}
                    type="file"
                    accept=".nc,.cnc,.tap,.ngc,.txt,.mpf,.ptp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {fileForm.formState.errors.file && (
                  <p className="text-xs text-red-500 mt-1">
                    {fileForm.formState.errors.file.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">
                  Description
                </label>
                <textarea
                  {...fileForm.register('description')}
                  placeholder="Optional description of this version..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm focus:outline-none resize-none transition-colors"
                />
                {fileForm.formState.errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {fileForm.formState.errors.description.message}
                  </p>
                )}
              </div>
            </form>
          ) : (
            <form
              id="nc-editor-form"
              onSubmit={editorForm.handleSubmit(handleEditorSubmit)}
              className="space-y-4"
            >
              {/* Program Name */}
              {mode === 'create' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Program Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...editorForm.register('name')}
                    placeholder="e.g. Fan Cover Base"
                  />
                  {editorForm.formState.errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {editorForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
              )}

              {/* Editor Workspace */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-t-xl px-4 py-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <FileCode size={14} className="text-indigo-600" />
                    gcode_workspace.nc
                  </div>
                  <div className="flex items-center gap-2">
                    {mode === 'addVersion' && loadPreviousContent && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={loadingContent}
                        onClick={loadPrevious}
                        className="h-7 text-[11px] px-2.5 font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 border-indigo-100 flex items-center gap-1"
                      >
                        <RefreshCw
                          size={11}
                          className={loadingContent ? 'animate-spin' : ''}
                        />
                        Load Previous
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={formatCode}
                      className="h-7 text-[11px] px-2.5 font-semibold text-gray-700 hover:text-indigo-700 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <Sparkles size={11} className="text-indigo-500" />
                      Format
                    </Button>
                    <button
                      type="button"
                      onClick={clearCode}
                      title="Clear code"
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 border-t-0 rounded-b-xl overflow-hidden relative shadow-inner bg-[#1e1e1e]">
                  {loadingContent && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg shadow-md border border-gray-100 text-xs font-semibold text-gray-700">
                        <RefreshCw
                          size={14}
                          className="animate-spin text-indigo-600"
                        />
                        Fetching G-code...
                      </div>
                    </div>
                  )}

                  <Editor
                    height="320px"
                    width="100%"
                    language={GCODE_LANGUAGE_ID}
                    value={editorContent}
                    theme="vs-dark"
                    beforeMount={handleEditorWillMount}
                    onMount={handleEditorDidMount}
                    onChange={handleEditorChange}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      wordWrap: 'on',
                      tabSize: 2,
                      scrollBeyondLastLine: false,
                      lineNumbersMinChars: 3,
                    }}
                  />
                </div>
                {editorForm.formState.errors.content && (
                  <p className="text-xs text-red-500 mt-1">
                    {editorForm.formState.errors.content.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">
                  Description
                </label>
                <textarea
                  {...editorForm.register('description')}
                  placeholder="Optional description of this version..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm focus:outline-none resize-none transition-colors"
                />
                {editorForm.formState.errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {editorForm.formState.errors.description.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-6 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={activeTab === 'upload' ? 'nc-file-form' : 'nc-editor-form'}
            variant="primary"
            disabled={loading || loadingContent}
            className="px-8 font-semibold"
          >
            {loading
              ? 'Saving...'
              : mode === 'create'
                ? 'Create Program'
                : 'Save Version'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NcEditorModal;
