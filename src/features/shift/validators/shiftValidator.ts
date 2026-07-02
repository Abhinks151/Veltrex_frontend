import { z } from 'zod';
import { ShiftType, ShiftRepeatType } from '../types';

export const shiftTemplateJobSchema = z.object({
  jobId: z.string().uuid('Job is required'),
  assignedQuantity: z.number().int().min(1, 'Quantity must be at least 1'),
  sequence: z.number().int().min(1, 'Sequence must be at least 1'),
});

export const shiftTemplateSchema = z.object({
  employeeId: z.string().uuid('Employee is required'),
  shiftType: z.nativeEnum(ShiftType, {
    message: 'Shift type is required',
  }),
  repeatType: z.nativeEnum(ShiftRepeatType, {
    message: 'Repeat type is required',
  }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  jobs: z
    .array(shiftTemplateJobSchema)
    .min(1, 'At least one job must be selected'),
});

export type ShiftTemplateFormData = z.infer<typeof shiftTemplateSchema>;
