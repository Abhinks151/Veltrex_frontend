import { z } from 'zod';
import { JobPriority, JobStatus } from '../types';

export const jobSchema = z.object({
  partId: z.string().uuid('Please select a valid part'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  priority: z.nativeEnum(JobPriority),
  repeat: z.boolean().default(false),
  assignedToUserId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(JobStatus).optional(),
});

export type JobFormData = z.infer<typeof jobSchema>;
