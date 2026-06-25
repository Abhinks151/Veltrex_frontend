import React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  rawMaterialSchema,
  type RawMaterialFormData,
} from '../validators/rawMaterialValidator';
import LookupSelect from '@/shared/components/LookupSelect';

interface RawMaterialFormProps {
  initialData?: Partial<RawMaterialFormData>;
  onSubmit: (data: RawMaterialFormData) => void;
  loading?: boolean;
}

const RawMaterialForm: React.FC<RawMaterialFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RawMaterialFormData>({
    resolver: zodResolver(rawMaterialSchema) as Resolver<RawMaterialFormData>,
    defaultValues: (initialData as RawMaterialFormData) || {
      name: '',
      material: '',
      minQty: 0,
      dimensions: {
        width: 0,
        length: 0,
        height: 0,
        unit: 'MM',
      },
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
            Raw Material Name
          </label>
          <Input {...register('name')} placeholder="e.g. Aluminum 6061 Block" />
          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Material */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Material Specification
          </label>
          <Input {...register('material')} placeholder="e.g. Al6061-T6" />
          {errors.material && (
            <p className="text-xs text-red-500">
              {errors.material.message as string}
            </p>
          )}
        </div>

        {/* Min Qty */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Minimum Stock Level
          </label>
          <Input
            type="number"
            {...register('minQty', { valueAsNumber: true })}
            placeholder="e.g. 10"
          />
          {errors.minQty && (
            <p className="text-xs text-red-500">
              {errors.minQty.message as string}
            </p>
          )}
        </div>

        {/* Unit */}
        <LookupSelect
          {...register('dimensions.unit')}
          category="UNIT"
          label="Dimension Unit"
          error={errors.dimensions?.unit?.message as string}
        />

        {/* Width */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Width</label>
          <Input
            type="number"
            {...register('dimensions.width', { valueAsNumber: true })}
            placeholder="Width"
          />
          {errors.dimensions?.width && (
            <p className="text-xs text-red-500">
              {errors.dimensions.width.message as string}
            </p>
          )}
        </div>

        {/* Length */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Length</label>
          <Input
            type="number"
            {...register('dimensions.length', { valueAsNumber: true })}
            placeholder="Length"
          />
          {errors.dimensions?.length && (
            <p className="text-xs text-red-500">
              {errors.dimensions.length.message as string}
            </p>
          )}
        </div>

        {/* Height */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Height</label>
          <Input
            type="number"
            {...register('dimensions.height', { valueAsNumber: true })}
            placeholder="Height"
          />
          {errors.dimensions?.height && (
            <p className="text-xs text-red-500">
              {errors.dimensions.height.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10"
        >
          {loading ? 'Saving...' : 'Save Raw Material'}
        </Button>
      </div>
    </form>
  );
};

export default RawMaterialForm;
