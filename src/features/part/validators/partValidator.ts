import { z } from 'zod';
import { OperationType, PartPriority } from '../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const partSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  partNumber: z.string().trim().min(1, 'Part number is required'),
  description: z.string().trim().optional(),
  material: z.string().trim().optional(),
  operationType: z.nativeEnum(OperationType).optional(),
  machineId: z
    .string()
    .uuid('Must be a valid UUID')
    .optional()
    .or(z.literal('')),
  fixtureId: z
    .string()
    .uuid('Must be a valid UUID')
    .optional()
    .or(z.literal('')),
  rawMaterialId: z
    .string()
    .uuid('Must be a valid UUID')
    .optional()
    .or(z.literal('')),
  dimensions: z
    .object({
      width: z.number().nonnegative('Width cannot be negative'),
      length: z.number().nonnegative('Length cannot be negative'),
      height: z.number().nonnegative('Height cannot be negative'),
      unit: z.string().min(1, 'Unit is required'),
    })
    .optional(),
  cycleTime: z
    .string()
    .regex(timeRegex, 'Format must be HH:MM:SS (e.g. 00:30:00)')
    .optional()
    .or(z.literal('')),
  setupTime: z
    .string()
    .regex(timeRegex, 'Format must be HH:MM:SS (e.g. 00:15:00)')
    .optional()
    .or(z.literal('')),
  priority: z.nativeEnum(PartPriority).optional(),
  setupSheet: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, 'Setup sheet must be <= 5MB')
    .refine((f) => f.type === 'application/pdf', 'Only PDF files are allowed')
    .optional(),
  engineeringDrawing: z
    .instanceof(File)
    .refine(
      (f) => f.size <= MAX_FILE_SIZE,
      'Engineering drawing must be <= 5MB',
    )
    .refine((f) => f.type === 'application/pdf', 'Only PDF files are allowed')
    .optional(),
});

export type PartFormData = z.infer<typeof partSchema>;
