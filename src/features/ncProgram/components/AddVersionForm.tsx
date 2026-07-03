import React, { useRef, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { FileText, X } from 'lucide-react';
import {
  addVersionSchema,
  type AddVersionFormData,
} from '../validators/ncProgramValidator';

interface AddVersionFormProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [ncFile, setNcFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddVersionFormData>({
    resolver: zodResolver(addVersionSchema) as Resolver<AddVersionFormData>,
    defaultValues: { description: '' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNcFile(file);
    setValue('file', file as File, { shouldValidate: true });
  };

  const handleFormSubmit = (data: AddVersionFormData) => {
    const formData = new FormData();
    formData.append('ncFile', data.file);
    if (data.description) formData.append('description', data.description);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700">
          NC Program File <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 text-sm border border-dashed border-gray-400 rounded-md text-gray-600 hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors flex items-center gap-2 w-full"
          >
            <FileText size={15} />
            {ncFile ? ncFile.name : 'Choose NC File (.nc, .cnc, .tap, .ngc...)'}
          </button>
          {ncFile && (
            <button
              type="button"
              onClick={() => {
                setNcFile(null);
                setValue('file', undefined as unknown as File);
              }}
            >
              <X size={16} className="text-red-500" />
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".nc,.cnc,.tap,.ngc,.txt,.mpf,.ptp"
          className="hidden"
          onChange={handleFileChange}
        />
        {errors.file && (
          <p className="text-xs text-red-500">{errors.file.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Optional version description..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10"
        >
          {loading ? 'Uploading...' : 'Upload New Version'}
        </Button>
      </div>
    </form>
  );
};

export default AddVersionForm;
