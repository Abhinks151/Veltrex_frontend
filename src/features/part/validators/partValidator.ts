import { z } from 'zod';
import { OperationType, PartPriority } from '../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
      width: z.number().positive('Width must be positive'),
      length: z.number().positive('Length must be positive'),
      height: z.number().positive('Height must be positive'),
      unit: z.string().min(1, 'Unit is required'),
    })
    .optional(),
  cycleTime: z.string().optional(),
  setupTime: z.string().optional(),
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
