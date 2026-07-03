import React, { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import { Input } from '@/shared/components/ui/input';
import LookupSelect from '@/shared/components/LookupSelect';
import type { Plan } from '@/services/planService';
import { planSchema, type PlanFormData } from '../validators/PLanValidator';

export type { PlanFormData };

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlanFormData) => void;
  submitting: boolean;
  selectedPlan: Plan | null;
}

const EMPTY_FORM_DATA: PlanFormData = {
  code: '',
  name: '',
  description: '',
  price: 0,
  currency: 'INR',
  durationDays: '',
};

const PlanForm: React.FC<PlanFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  selectedPlan,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema) as Resolver<PlanFormData>,
    defaultValues: EMPTY_FORM_DATA,
  });

  // Re-sync the form whenever the modal opens or the target plan changes
  useEffect(() => {
    if (!isOpen) return;

    reset(
      selectedPlan
        ? {
            code: selectedPlan.code,
            name: selectedPlan.name,
            description: selectedPlan.description || '',
            price: selectedPlan.price,
            currency: selectedPlan.currency,
            durationDays: selectedPlan.durationDays ?? '',
          }
        : EMPTY_FORM_DATA,
    );
  }, [isOpen, selectedPlan, reset]);

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedPlan ? 'Edit Plan' : 'Create New Plan'}
      showFooter
      onSubmit={handleSubmit(onSubmit)}
      submitText={selectedPlan ? 'Update Plan' : 'Create Plan'}
      loading={submitting}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Code (Unique identifier)
            </label>
            <Input
              disabled={!!selectedPlan}
              placeholder="e.g. TRIAL, PREMIUM"
              {...register('code', {
                setValueAs: (v: string) => v.toUpperCase(),
              })}
            />
            {errors.code && (
              <p className="text-xs text-red-500">
                {errors.code.message as string}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <Input placeholder="e.g. Free Trial" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-red-500">
                {errors.name.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[80px]"
            placeholder="What's included in this plan?"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-red-500">
              {errors.description.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Price</label>
            <Input
              type="number"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-red-500">
                {errors.price.message as string}
              </p>
            )}
          </div>

          <LookupSelect
            {...register('currency')}
            category="CURRENCY"
            label="Currency"
            error={errors.currency?.message as string}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Duration (Days)
            </label>
            <Input
              type="number"
              placeholder="Leave empty for lifetime"
              {...register('durationDays')}
            />
            {errors.durationDays && (
              <p className="text-xs text-red-500">
                {errors.durationDays.message as string}
              </p>
            )}
          </div>
        </div>
        <p className="text-[11px] text-gray-400 italic">
          * Duration in days. Set to 0 or leave empty for a "lifetime/unlimited"
          plan.
        </p>
      </div>
    </ReusableModal>
  );
};

export default PlanForm;
