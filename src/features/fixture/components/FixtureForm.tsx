import React from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  fixtureSchema,
  type FixtureFormData,
} from '../validators/fixtureValidator';
import LookupSelect from '@/shared/components/LookupSelect';

interface FixtureFormProps {
  initialData?: Partial<FixtureFormData>;
  onSubmit: (data: FixtureFormData) => void;
  loading?: boolean;
}

const FixtureForm: React.FC<FixtureFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FixtureFormData>({
    resolver: zodResolver(fixtureSchema) as Resolver<FixtureFormData>,
    defaultValues: (initialData as FixtureFormData) || {
      name: '',
      type: 'MILL',
      dimensions: {
        width: 0,
        length: 0,
        height: 0,
        unit: 'MM',
      },
    },
  });

  const type = useWatch({ control, name: 'type' });
  const unit = useWatch({ control, name: 'dimensions.unit' });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData as FixtureFormData);
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Fixture Name
          </label>
          <Input {...register('name')} placeholder="e.g. Vise Plate A" />
          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Type */}
        <LookupSelect
          {...register('type')}
          category="MACHINE_TYPE"
          label="Fixture Type"
          error={errors.type?.message as string}
          value={type}
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

        {/* Unit */}
        <LookupSelect
          {...register('dimensions.unit')}
          category="UNIT"
          label="Unit"
          error={errors.dimensions?.unit?.message as string}
          value={unit}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10"
        >
          {loading ? 'Saving...' : 'Save Fixture'}
        </Button>
      </div>
    </form>
  );
};

export default FixtureForm;
