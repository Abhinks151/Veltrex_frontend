import React, { useEffect, useRef, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { partSchema, type PartFormData } from '../validators/partValidator';
import {
  OperationType,
  PartPriority,
  type Part,
  type PartDimensions,
} from '../types';
import { FileText, X } from 'lucide-react';
import { machineService } from '@/services/machineService';
import { fixtureService } from '@/services/fixtureService';
import { rawMaterialService } from '@/services/rawMaterialService';

const SELECT_CLASS =
  'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]';

interface PartFormProps {
  initialData?: Partial<Part>;
  onSubmit: (formData: FormData) => void;
  loading?: boolean;
}

const PartForm: React.FC<PartFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const [machines, setMachines] = useState<{ id: string; name: string }[]>([]);
  const [fixtures, setFixtures] = useState<{ id: string; name: string }[]>([]);
  const [materials, setMaterials] = useState<{ id: string; name: string }[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PartFormData>({
    resolver: zodResolver(partSchema) as Resolver<PartFormData>,
    defaultValues: {
      name: initialData?.name ?? '',
      partNumber: initialData?.partNumber ?? '',
      description: initialData?.description ?? '',
      material: initialData?.material ?? '',
      operationType: initialData?.operationType ?? undefined,
      machineId: initialData?.machineId ?? '',
      fixtureId: initialData?.fixtureId ?? '',
      rawMaterialId: initialData?.rawMaterialId ?? '',
      cycleTime: initialData?.cycleTime ?? '',
      setupTime: initialData?.setupTime ?? '',
      priority: initialData?.priority ?? PartPriority.MEDIUM,
      dimensions: (initialData?.dimensions as PartDimensions) ?? {
        width: 0,
        length: 0,
        height: 0,
        unit: 'mm',
      },
    },
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [mRes, fRes, rmRes] = await Promise.all([
          machineService.getActive(),
          fixtureService.getActive(),
          rawMaterialService.getActive(),
        ]);
        if (mRes.data.success) setMachines(mRes.data.data || []);
        if (fRes.data.success) setFixtures(fRes.data.data || []);
        if (rmRes.data.success) setMaterials(rmRes.data.data || []);
      } catch (err) {
        console.error('Failed to load form options', err);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (initialData?.machineId && machines.length > 0) {
      setValue('machineId', initialData.machineId);
    }
  }, [machines, initialData?.machineId, setValue]);

  useEffect(() => {
    if (initialData?.fixtureId && fixtures.length > 0) {
      setValue('fixtureId', initialData.fixtureId);
    }
  }, [fixtures, initialData?.fixtureId, setValue]);

  useEffect(() => {
    if (initialData?.rawMaterialId && materials.length > 0) {
      setValue('rawMaterialId', initialData.rawMaterialId);
    }
  }, [materials, initialData?.rawMaterialId, setValue]);

  const [setupSheetFile, setSetupSheetFile] = useState<File | null>(null);
  const [engineeringDrawingFile, setEngDrawingFile] = useState<File | null>(
    null,
  );
  const setupSheetRef = useRef<HTMLInputElement>(null);
  const engDrawingRef = useRef<HTMLInputElement>(null);

  const handleFileChange =
    (
      setter: React.Dispatch<React.SetStateAction<File | null>>,
      field: 'setupSheet' | 'engineeringDrawing',
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setter(file);
      setValue(field, file ?? undefined);
    };

  const handleFormSubmit = (data: PartFormData) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('partNumber', data.partNumber);
    if (data.description) formData.append('description', data.description);
    if (data.material) formData.append('material', data.material);
    if (data.operationType)
      formData.append('operationType', data.operationType);

    // Convert empty strings to null or omit them for the backend
    if (data.machineId && data.machineId !== '')
      formData.append('machineId', data.machineId);
    if (data.fixtureId && data.fixtureId !== '')
      formData.append('fixtureId', data.fixtureId);
    if (data.rawMaterialId && data.rawMaterialId !== '')
      formData.append('rawMaterialId', data.rawMaterialId);

    if (data.cycleTime) formData.append('cycleTime', data.cycleTime);
    if (data.setupTime) formData.append('setupTime', data.setupTime);
    if (data.priority) formData.append('priority', data.priority);
    if (data.dimensions)
      formData.append('dimensions', JSON.stringify(data.dimensions));
    if (setupSheetFile) formData.append('setupSheet', setupSheetFile);
    if (engineeringDrawingFile)
      formData.append('engineeringDrawing', engineeringDrawingFile);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Row 1: Name + Part Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Part Name <span className="text-red-500">*</span>
          </label>
          <Input {...register('name')} placeholder="e.g. Bracket A" />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Part Number <span className="text-red-500">*</span>
          </label>
          <Input {...register('partNumber')} placeholder="e.g. PN-001" />
          {errors.partNumber && (
            <p className="text-xs text-red-500">{errors.partNumber.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Selected Machine + Fixture + Raw Material */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Machine</label>
          <select {...register('machineId')} className={SELECT_CLASS}>
            <option value="">No machine</option>
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Fixture</label>
          <select {...register('fixtureId')} className={SELECT_CLASS}>
            <option value="">No fixture</option>
            {fixtures.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Raw Material
          </label>
          <select {...register('rawMaterialId')} className={SELECT_CLASS}>
            <option value="">No raw material</option>
            {materials.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2.5: Material Text + Operation Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Material Specification
          </label>
          <Input {...register('material')} placeholder="e.g. Aluminium 6061" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Operation Type
          </label>
          <select {...register('operationType')} className={SELECT_CLASS}>
            <option value="">Select operation type</option>
            <option value={OperationType.MILL}>Mill</option>
            <option value={OperationType.LATHE}>Lathe</option>
          </select>
        </div>
      </div>

      {/* Row 3: Priority + Cycle Time + Setup Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Priority
          </label>
          <select {...register('priority')} className={SELECT_CLASS}>
            {Object.values(PartPriority).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Cycle Time
          </label>
          <Input {...register('cycleTime')} placeholder="e.g. 00:30:00" />
          {errors.cycleTime && (
            <p className="text-xs text-red-500">{errors.cycleTime.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Setup Time
          </label>
          <Input {...register('setupTime')} placeholder="e.g. 00:15:00" />
          {errors.setupTime && (
            <p className="text-xs text-red-500">{errors.setupTime.message}</p>
          )}
        </div>
      </div>

      {/* Row 4: Dimensions */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Dimensions
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Width</label>
            <Input
              type="number"
              {...register('dimensions.width', { valueAsNumber: true })}
              placeholder="Width"
            />
            {errors.dimensions?.width && (
              <p className="text-[10px] text-red-500">
                {errors.dimensions.width.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Length</label>
            <Input
              type="number"
              {...register('dimensions.length', { valueAsNumber: true })}
              placeholder="Length"
            />
            {errors.dimensions?.length && (
              <p className="text-[10px] text-red-500">
                {errors.dimensions.length.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Height</label>
            <Input
              type="number"
              {...register('dimensions.height', { valueAsNumber: true })}
              placeholder="Height"
            />
            {errors.dimensions?.height && (
              <p className="text-[10px] text-red-500">
                {errors.dimensions.height.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Unit</label>
            <select {...register('dimensions.unit')} className={SELECT_CLASS}>
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 5: Description */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Optional part description..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] resize-none"
        />
      </div>

      {/* Row 6: PDF Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Setup Sheet */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Setup Sheet (PDF, max 5MB)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setupSheetRef.current?.click()}
              className="px-3 py-2 text-sm border border-dashed border-gray-400 rounded-md text-gray-600 hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors flex items-center gap-2 w-full"
            >
              <FileText size={15} />
              {setupSheetFile
                ? setupSheetFile.name
                : initialData?.setupSheet
                  ? 'Replace file'
                  : 'Choose PDF'}
            </button>
            {setupSheetFile && (
              <button
                type="button"
                onClick={() => {
                  setSetupSheetFile(null);
                  setValue('setupSheet', undefined);
                }}
              >
                <X size={16} className="text-red-500" />
              </button>
            )}
          </div>
          <input
            ref={setupSheetRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange(setSetupSheetFile, 'setupSheet')}
          />
          {initialData?.setupSheet && !setupSheetFile && (
            <a
              href={initialData.setupSheet}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#4f46e5] underline"
            >
              View current file
            </a>
          )}
          {errors.setupSheet && (
            <p className="text-xs text-red-500">
              {errors.setupSheet.message as string}
            </p>
          )}
        </div>

        {/* Engineering Drawing */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Engineering Drawing (PDF, max 5MB)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => engDrawingRef.current?.click()}
              className="px-3 py-2 text-sm border border-dashed border-gray-400 rounded-md text-gray-600 hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors flex items-center gap-2 w-full"
            >
              <FileText size={15} />
              {engineeringDrawingFile
                ? engineeringDrawingFile.name
                : initialData?.engineeringDrawing
                  ? 'Replace file'
                  : 'Choose PDF'}
            </button>
            {engineeringDrawingFile && (
              <button
                type="button"
                onClick={() => {
                  setEngDrawingFile(null);
                  setValue('engineeringDrawing', undefined);
                }}
              >
                <X size={16} className="text-red-500" />
              </button>
            )}
          </div>
          <input
            ref={engDrawingRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange(setEngDrawingFile, 'engineeringDrawing')}
          />
          {initialData?.engineeringDrawing && !engineeringDrawingFile && (
            <a
              href={initialData.engineeringDrawing}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#4f46e5] underline"
            >
              View current file
            </a>
          )}
          {errors.engineeringDrawing && (
            <p className="text-xs text-red-500">
              {errors.engineeringDrawing.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10"
        >
          {loading
            ? 'Saving...'
            : initialData?.id
              ? 'Update Part'
              : 'Create Part'}
        </Button>
      </div>
    </form>
  );
};

export default PartForm;
