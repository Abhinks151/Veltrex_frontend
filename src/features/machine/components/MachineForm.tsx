import React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  machineSchema,
  type MachineFormData,
} from '../validators/machineValidator';
import LookupSelect from '@/shared/components/LookupSelect';

interface MachineFormProps {
  initialData?: Partial<MachineFormData>;
  onSubmit: (data: MachineFormData) => void;
  loading?: boolean;
}

const MachineForm: React.FC<MachineFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema) as Resolver<MachineFormData>,
    defaultValues: (initialData as MachineFormData) || {
      status: 'IDLE',
      type: 'MILL',
      name: '',
      brand: '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Machine Name
          </label>
          <Input {...register('name')} placeholder="e.g. CNC Mill 01" />
          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Brand */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Brand</label>
          <Input {...register('brand')} placeholder="e.g. Haas" />
          {errors.brand && (
            <p className="text-xs text-red-500">
              {errors.brand.message as string}
            </p>
          )}
        </div>

        {/* Type */}
        <LookupSelect
          {...register('type')}
          category="TYPE"
          label="Machine Type"
          error={errors.type?.message as string}
        />

        {/* Axis */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Axis</label>
          <Input
            type="number"
            {...register('axis', { valueAsNumber: true })}
            placeholder="Number of axis"
          />
          {errors.axis && (
            <p className="text-xs text-red-500">
              {errors.axis.message as string}
            </p>
          )}
        </div>

        {/* Max RPM */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Max RPM</label>
          <Input
            type="number"
            {...register('maxRpm', { valueAsNumber: true })}
            placeholder="Max RPM"
          />
          {errors.maxRpm && (
            <p className="text-xs text-red-500">
              {errors.maxRpm.message as string}
            </p>
          )}
        </div>

        {/* Max Travel Speed */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Max Travel Speed (m/min)
          </label>
          <Input
            type="number"
            {...register('maxTravelSpeed', { valueAsNumber: true })}
            placeholder="Speed"
          />
          {errors.maxTravelSpeed && (
            <p className="text-xs text-red-500">
              {errors.maxTravelSpeed.message as string}
            </p>
          )}
        </div>

        {/* Holding Size */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Holding Size (mm)
          </label>
          <Input
            type="number"
            {...register('holdingSize', { valueAsNumber: true })}
            placeholder="Size"
          />
          {errors.holdingSize && (
            <p className="text-xs text-red-500">
              {errors.holdingSize.message as string}
            </p>
          )}
        </div>

        {/* Tool Count */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Tool Count
          </label>
          <Input
            type="number"
            {...register('toolCount', { valueAsNumber: true })}
            placeholder="Count"
          />
          {errors.toolCount && (
            <p className="text-xs text-red-500">
              {errors.toolCount.message as string}
            </p>
          )}
        </div>

        {/* Status */}
        <LookupSelect
          {...register('status')}
          category="MACHINE_STATUS"
          label="Status"
          error={errors.status?.message as string}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10"
        >
          {loading ? 'Saving...' : 'Save Machine'}
        </Button>
      </div>
    </form>
  );
};

export default MachineForm;
