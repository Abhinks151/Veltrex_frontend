import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { TenantFormProps } from '../types/propsTypes';
import { BuildingIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Error from '@/shared/components/custom/Error';
import { notifyError } from '@/shared/utils/toasterUtils';
import { useEffect } from 'react';
import { tenantSchema, type tenantFormData } from '../validators/tenant.schema';

const TenantForm = ({ onSubmit, loading, error }: TenantFormProps) => {
  // const [email, setEmail] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  useEffect(() => {
    if (error) {
      notifyError(error);
    }
  }, [error]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<tenantFormData>({
    resolver: zodResolver(tenantSchema),
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md p-8 w-[100]"
      >
        <h2 className="text-xl font-semibold mb-1">Create Organization</h2>

        <p className="text-sm text-gray-500 mb-6">
          Start your 30-day free trial today.
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Organization Name
          </label>

          <div className="relative">
            <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <Input
              placeholder="My Org"
              className="pl-10"
              {...register('name')}
            />
          </div>
        </div>

        {/* Error */}
        {errors.name && <Error message={errors.name.message} />}

        {/* Button */}
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="xl"
          className="w-full"
        >
          {loading ? 'Creating organization...' : 'Create Organization'}
        </Button>

        {/* <div className="text-center mt-4">
          <p>
            Go back to login page.<Link to="/auth/login">Login</Link>
          </p>
        </div> */}
        <div className="text-center mt-4">
          <p>
            Go back to login page.{' '}
            <Link to="/auth/register" className="text-blue-500 hover:underline cursor-pointer">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default TenantForm;
