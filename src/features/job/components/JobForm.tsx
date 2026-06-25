import React, { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { jobSchema, type JobFormData } from '../validators/jobValidator';
import { JobStatus } from '../types';
import { partService } from '@/services/partService';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchEmployees } from '@/features/employee/employeeThunk';
import { UserRole } from '@/features/employee/types';
import LookupSelect from '@/shared/components/LookupSelect';

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => void;
  loading?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employee);
  const [parts, setParts] = useState<
    { id: string; name: string; partNumber: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema) as Resolver<JobFormData>,
    defaultValues: initialData || {
      partId: '',
      quantity: 1,
      priority: 'MEDIUM',
      repeat: false,
      status: JobStatus.PENDING,
    },
  });

  useEffect(() => {
    const loadParts = async () => {
      try {
        const response = await partService.getActive();
        if (response.data.success) {
          setParts(response.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load parts', err);
      }
    };
    loadParts();

    dispatch(fetchEmployees({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (initialData?.partId && parts.length > 0) {
      setValue('partId', initialData.partId);
    }
  }, [parts, initialData?.partId, setValue]);

  useEffect(() => {
    if (initialData?.assignedToUserId && employees.length > 0) {
      setValue('assignedToUserId', initialData.assignedToUserId || '');
    }
  }, [employees, initialData?.assignedToUserId, setValue]);

  const eligibleAssignees = employees.filter(
    (emp) =>
      emp.role === UserRole.MACHINIST || emp.role === UserRole.MAINTENANCE,
  );

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Part</label>
          <select
            {...register('partId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
          >
            <option value="">Select a part</option>
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.name} ({part.partNumber})
              </option>
            ))}
          </select>
          {errors.partId && (
            <p className="text-xs text-red-500">
              {errors.partId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Quantity
          </label>
          <Input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            placeholder="Enter quantity"
          />
          {errors.quantity && (
            <p className="text-xs text-red-500">
              {errors.quantity.message as string}
            </p>
          )}
        </div>

        <LookupSelect
          {...register('priority')}
          category="PRIORITY"
          label="Priority"
          error={errors.priority?.message as string}
        />

        {/* Assignee Selection */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Assigned To
          </label>
          <select
            {...register('assignedToUserId')}
            onChange={(e) =>
              setValue('assignedToUserId', e.target.value || null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
          >
            <option value="">Unassigned</option>
            {eligibleAssignees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>
          {errors.assignedToUserId && (
            <p className="text-xs text-red-500">
              {errors.assignedToUserId.message as string}
            </p>
          )}
        </div>

        {initialData && (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
            >
              {Object.values(JobStatus).map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-xs text-red-500">
                {errors.status.message as string}
              </p>
            )}
          </div>
        )}

        {/* Repeat Toggle */}
        <div className="flex items-center space-x-2 pt-6">
          <input
            {...register('repeat')}
            type="checkbox"
            id="repeat"
            className="w-4 h-4 text-[#4f46e5] border-gray-300 rounded focus:ring-[#4f46e5]"
          />
          <label
            htmlFor="repeat"
            className="text-sm font-semibold text-gray-700"
          >
            Repeat Job?
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10"
        >
          {loading ? 'Saving...' : initialData ? 'Update Job' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
