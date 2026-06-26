import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  employeeUpdateSchema,
  bulkEmployeeCreateSchema,
  type EmployeeUpdateFormData,
  type BulkEmployeeCreateFormData,
  type EmployeeFormSubmitData,
} from '../validators/employeeValidator';

import { UserRole } from '../types';

interface EmployeeFormProps {
  initialData?: Partial<EmployeeUpdateFormData>;
  onSubmit: (data: EmployeeFormSubmitData) => void;

  loading?: boolean;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  isEdit = false,
}) => {
  // Use separate forms for edit and create to avoid complex conditional types
  const createForm = useForm<BulkEmployeeCreateFormData>({
    resolver: zodResolver(bulkEmployeeCreateSchema),
    defaultValues: {
      employees: [{ name: '', email: '', role: UserRole.MACHINIST }],
    },
  });

  const updateForm = useForm<EmployeeUpdateFormData>({
    resolver: zodResolver(employeeUpdateSchema),
    defaultValues: initialData || {
      name: '',
      role: UserRole.MACHINIST,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: createForm.control,
    name: 'employees',
  });

  const onFormSubmit = (data: EmployeeFormSubmitData) => {
    onSubmit(data);
  };

  if (isEdit) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = updateForm;

    return (
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <Input {...register('name')} placeholder="Full Name" />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

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
            {loading ? 'Saving...' : 'Update Employee'}
          </Button>
        </div>
      </form>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = createForm;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-4 relative animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex justify-between items-center bg-gray-100 -m-4 mb-4 px-4 py-2 rounded-t-lg">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Employee #{index + 1}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Remove Employee"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <Input
                  {...register(`employees.${index}.name`)}
                  placeholder="Full Name"
                />
                {errors.employees?.[index]?.name && (
                  <p className="text-xs text-red-500">
                    {errors.employees[index]?.name?.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <Input
                  {...register(`employees.${index}.email`)}
                  placeholder="Email Address"
                />
                {errors.employees?.[index]?.email && (
                  <p className="text-xs text-red-500">
                    {errors.employees[index]?.email?.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Role
                </label>
                <select
                  {...register(`employees.${index}.role`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
                >
                  <option value={UserRole.MACHINIST}>Machinist</option>
                  <option value={UserRole.MAINTENANCE}>Maintenance</option>
                </select>
                {errors.employees?.[index]?.role && (
                  <p className="text-xs text-red-500">
                    {errors.employees[index]?.role?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({ name: '', email: '', role: UserRole.MACHINIST })
          }
          className="w-full border-dashed border-2 flex items-center justify-center gap-2 py-6 hover:bg-gray-50"
        >
          <Plus size={20} />
          <span>Add Another Employee</span>
        </Button>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-10 shadow-lg"
          >
            {loading ? 'Creating Employees...' : 'Create Employees'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;
