import { z } from 'zod';

const ALLOWED_NC_EXTENSIONS = [
  '.nc',
  '.cnc',
  '.tap',
  '.ngc',
  '.txt',
  '.mpf',
  '.ptp',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ncProgramSchema = z.object({
  name: z.string().trim().min(2, 'Program name must be at least 2 characters'),
});

export const ncVersionFileSchema = z
  .instanceof(File, { message: 'NC file is required' })
  .refine((file) => file.size > 0, 'File cannot be empty')
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    'File must be smaller than 10MB',
  )
  .refine(
    (file) =>
      ALLOWED_NC_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext),
      ),
    `Only NC program files are allowed (${ALLOWED_NC_EXTENSIONS.join(', ')})`,
  );

export const createNcProgramSchema = z.object({
  name: z.string().trim().min(2, 'Program name must be at least 2 characters'),
  file: ncVersionFileSchema,
  description: z.string().trim().optional(),
});

export const addVersionSchema = z.object({
  file: ncVersionFileSchema,
  description: z.string().trim().optional(),
});

export const editNcProgramSchema = z.object({
  name: z.string().trim().min(2, 'Program name must be at least 2 characters'),
});

export type CreateNcProgramFormData = z.infer<typeof createNcProgramSchema>;
export type AddVersionFormData = z.infer<typeof addVersionSchema>;
export type EditNcProgramFormData = z.infer<typeof editNcProgramSchema>;
