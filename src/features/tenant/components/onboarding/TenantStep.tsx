import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BuildingIcon } from 'lucide-react';

import { useAppSelector } from '@/app/store/hooks';
import {
  tenantSchema,
  type tenantFormData,
} from '@/features/tenant/validators/tenant.schema';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import Error from '@/shared/components/custom/Error';

interface TenantStepProps {
  onNext: (data: tenantFormData) => Promise<void>;
  isLoading?: boolean;
  defaultName?: string;
}

const TenantStep = ({ onNext, isLoading, defaultName }: TenantStepProps) => {
  const { loading: creating } = useAppSelector((state) => state.tenant);
  const loading = creating || isLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<tenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: defaultName || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Organization Name <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="e.g. Acme Machining Pvt. Ltd."
            className="pl-10"
            {...register('name')}
          />
        </div>
        {errors.name && <Error message={errors.name.message} />}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2"
        disabled={loading}
      >
        {loading ? (isLoading ? 'Checking...' : 'Creating…') : 'Continue →'}
      </Button>
    </form>
  );
};

export default TenantStep;
