import { useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { BuildingIcon, GlobeIcon } from 'lucide-react';

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
    control,
    formState: { errors },
  } = useForm<tenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: defaultName || '',
      subdomain: '',
    },
  });

  const watchedSubdomain = useWatch({
    control,
    name: 'subdomain',
  });
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'localhost';

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

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Subdomain <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="your-company"
            className="pl-10"
            {...register('subdomain')}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          Your workspace URL will be:{' '}
          <span className="text-indigo-500 font-medium whitespace-nowrap">
            {watchedSubdomain || 'your-company'}.{baseDomain}
          </span>
        </p>
        {errors.subdomain && <Error message={errors.subdomain.message} />}
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
