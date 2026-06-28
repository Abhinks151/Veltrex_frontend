import { z } from 'zod';
import { JobStatus } from '../types';

export const jobSchema = z.object({
  partId: z.string().uuid('Please select a valid part'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  priority: z.string().min(1, 'Priority is required'),
  repeat: z.boolean().default(false),
  status: z.nativeEnum(JobStatus).optional(),
});

export type JobFormData = z.infer<typeof jobSchema>;
