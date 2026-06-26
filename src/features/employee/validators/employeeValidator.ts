import { z } from 'zod';
import { UserRole } from '../types';

export const employeeCreateSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
});

export const employeeUpdateSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  role: z.nativeEnum(UserRole),
});

export type EmployeeCreateFormData = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateFormData = z.infer<typeof employeeUpdateSchema>;

export const bulkEmployeeCreateSchema = z.object({
  employees: z
    .array(employeeCreateSchema)
    .min(1, 'At least one employee is required'),
});

export type BulkEmployeeCreateFormData = z.infer<
  typeof bulkEmployeeCreateSchema
>;

export type EmployeeFormSubmitData =
  | BulkEmployeeCreateFormData
  | EmployeeUpdateFormData;
