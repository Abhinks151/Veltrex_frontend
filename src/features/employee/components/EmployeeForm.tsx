import React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  employeeCreateSchema,
  employeeUpdateSchema,
  type EmployeeCreateFormData,
  type EmployeeUpdateFormData,
} from '../validators/employeeValidator';
import { UserRole } from '../types';

interface EmployeeFormProps {
  initialData?: Partial<EmployeeUpdateFormData>;
  onSubmit: (data: EmployeeCreateFormData | EmployeeUpdateFormData) => void;
  loading?: boolean;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeCreateFormData>({
    resolver: zodResolver(
      isEdit ? employeeUpdateSchema : employeeCreateSchema,
    ) as unknown as Resolver<EmployeeCreateFormData>,
    defaultValues: (initialData as EmployeeCreateFormData) || {
      name: '',
      email: '',
      role: UserRole.MACHINIST,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <Input {...register('name')} placeholder="Full Name" />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email - Only for Create */}
        {!isEdit && (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <Input {...register('email')} placeholder="Email Address" />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        )}

        {/* Role */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Role</label>
          <select
            {...register('role')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
          >
            <option value={UserRole.MACHINIST}>Machinist</option>
            <option value={UserRole.MAINTENANCE}>Maintenance</option>
          </select>
          {errors.role && (
            <p className="text-xs text-red-500">{errors.role.message}</p>
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
          {loading
            ? 'Saving...'
            : isEdit
              ? 'Update Employee'
              : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
