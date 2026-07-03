import React, { useEffect, useState } from 'react';
import {
  useForm,
  useFieldArray,
  useWatch,
  type Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  shiftTemplateSchema,
  type ShiftTemplateFormData,
} from '../validators/shiftValidator';
import { ShiftType, ShiftRepeatType } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
// import { machineService } from '@/services/machineService';
import { employeeService } from '@/services/employeeService';
import { jobService } from '@/services/jobService';
// import type { Machine } from '@/features/machine/types';
import type { Employee } from '@/features/employee/types';
import type { Job } from '@/features/job/types';
import LookupSelect from '@/shared/components/LookupSelect';

interface ShiftTemplateFormProps {
  initialData?: Partial<ShiftTemplateFormData>;
  onSubmit: (data: ShiftTemplateFormData) => void;
  loading?: boolean;
}

const ShiftTemplateForm: React.FC<ShiftTemplateFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<ShiftTemplateFormData>({
    resolver: zodResolver(
      shiftTemplateSchema,
    ) as Resolver<ShiftTemplateFormData>,
    defaultValues: initialData || {
      shiftType: ShiftType.MORNING,
      repeatType: ShiftRepeatType.DAILY,
      jobs: [{ jobId: '', assignedQuantity: 1, sequence: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jobs',
  });

  useEffect(() => {
    if (!initialData) return;

    const needsEmployeeList = !!initialData.employeeId;
    const needsJobList = !!initialData.jobs && initialData.jobs.length > 0;

    if (needsEmployeeList && employees.length === 0) return;
    if (needsJobList && jobs.length === 0) return;

    reset({
      shiftType: ShiftType.MORNING,
      repeatType: ShiftRepeatType.DAILY,
      jobs: [{ jobId: '', assignedQuantity: 1, sequence: 1 }],
      ...initialData,
    });
  }, [initialData, employees, jobs, reset]);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [employeeRes, jobRes] = await Promise.allSettled([
          employeeService.list({ page: 1, limit: 100 }),
          jobService.list({ page: 1, limit: 100 }),
        ]);

        if (
          employeeRes.status === 'fulfilled' &&
          employeeRes.value.data.success
        ) {
          setEmployees(
            (employeeRes.value.data.data?.users || []).filter(
              (e) => e.role === 'MACHINIST',
            ),
          );
        }
        if (jobRes.status === 'fulfilled' && jobRes.value.data.success) {
          setJobs(
            (jobRes.value.data.data?.items || []).filter(
              (j) => j.status !== 'COMPLETED' && j.status !== 'CANCELLED',
            ),
          );
        }
      } catch (err) {
        console.error('Failed to load lookups', err);
      }
    };
    loadLookups();
  }, []);

  const selectClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]';
  const errorClass = 'text-xs text-red-500 mt-1';

  const toDateInputValue = (d: Date) => {
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60 * 1000)
      .toISOString()
      .split('T')[0];
  };
  const todayStr = toDateInputValue(new Date());

  const startDateValue = useWatch({ control, name: 'startDate' });
  const endDateMin =
    startDateValue && startDateValue > todayStr ? startDateValue : todayStr;

  const handleFormSubmit = (data: ShiftTemplateFormData) => {
    if (data.startDate < todayStr) {
      setError('startDate', {
        type: 'manual',
        message: 'Start date cannot be before today',
      });
      return;
    }
    if (data.endDate && data.endDate <= data.startDate) {
      setError('endDate', {
        type: 'manual',
        message: 'End date must be after the start date',
      });
      return;
    }

    const cleanedJobs = data.jobs.map((j, index) => ({
      ...j,
      sequence: index + 1,
    }));
    onSubmit({
      ...data,
      jobs: cleanedJobs,
    });
  };

  const handleJobSelectChange = (index: number, jobId: string) => {
    const selectedJob = jobs.find((j) => j.id === jobId);
    if (selectedJob) {
      setValue(`jobs.${index}.assignedQuantity`, selectedJob.quantity);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Row 1: Employee */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Employee (Machinist)
          </label>
          <select {...register('employeeId')} className={selectClass}>
            <option value="">Select an employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.email}
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <p className={errorClass}>{errors.employeeId.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Shift Type & Repeat Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Shift Type
          </label>
          <select {...register('shiftType')} className={selectClass}>
            {Object.values(ShiftType).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.shiftType && (
            <p className={errorClass}>{errors.shiftType.message}</p>
          )}
        </div> */}
        <LookupSelect
          category="SHIFT_TYPE"
          label="Shift Type"
          placeholder="Select Shift Type"
          error={errors.shiftType?.message}
          className={selectClass}
          {...register('shiftType')}
        />

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">Repeat</label>
          <select {...register('repeatType')} className={selectClass}>
            <option value={ShiftRepeatType.NONE}>One-time (No repeat)</option>
            <option value={ShiftRepeatType.DAILY}>Daily</option>
          </select>
          {errors.repeatType && (
            <p className={errorClass}>{errors.repeatType.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Start & End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            Start Date
          </label>
          <Input type="date" min={todayStr} {...register('startDate')} />
          {errors.startDate && (
            <p className={errorClass}>{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            End Date
          </label>
          <Input type="date" min={endDateMin} {...register('endDate')} />
          {errors.endDate && (
            <p className={errorClass}>{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Row 4: Jobs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">Jobs</label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              append({
                jobId: '',
                assignedQuantity: 1,
                sequence: fields.length + 1,
              })
            }
            className="flex items-center gap-1 text-xs"
          >
            <Plus size={14} />
            Add Job
          </Button>
        </div>

        {errors.jobs &&
          typeof errors.jobs === 'object' &&
          !Array.isArray(errors.jobs) && (
            <p className={errorClass}>
              {(errors.jobs as { message?: string }).message}
            </p>
          )}

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
            >
              {/* Index Number Label */}
              <div className="col-span-1 flex justify-center font-bold text-gray-400">
                #{index + 1}
              </div>

              {/* Job select */}
              <div className="col-span-8">
                <select
                  {...register(`jobs.${index}.jobId`)}
                  onChange={(e) => {
                    register(`jobs.${index}.jobId`).onChange(e);
                    handleJobSelectChange(index, e.target.value);
                  }}
                  className={selectClass}
                >
                  <option value="">Select a job</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.part?.name || 'Unknown'} — #{j.part?.partNumber} (qty:{' '}
                      {j.quantity})
                    </option>
                  ))}
                </select>
                {errors.jobs?.[index]?.jobId && (
                  <p className={errorClass}>
                    {errors.jobs[index]?.jobId?.message}
                  </p>
                )}
              </div>

              {/* Assigned quantity */}
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Qty"
                  {...register(`jobs.${index}.assignedQuantity`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.jobs?.[index]?.assignedQuantity && (
                  <p className={errorClass}>
                    {errors.jobs[index]?.assignedQuantity?.message}
                  </p>
                )}
              </div>

              {/* Remove */}
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-red-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full md:w-auto px-10"
        >
          {loading
            ? 'Saving...'
            : initialData && Object.keys(initialData).length > 0
              ? 'Update Template'
              : 'Create Template'}
        </Button>
      </div>
    </form>
  );
};

export default ShiftTemplateForm;
