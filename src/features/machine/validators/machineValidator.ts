import { z } from 'zod';
import { MachineType } from '@/shared/types/machine-type.enum';
import { MachineStatus } from '@/shared/types/machine-status.enum';

export const machineSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  brand: z.string().trim().min(1, 'Brand is required'),
  maxRpm: z.number().positive('Max RPM must be positive'),
  axis: z.number().positive('Axis must be positive'),
  type: z.nativeEnum(MachineType),
  maxTravelSpeed: z.number().positive('Max Travel Speed must be positive'),
  holdingSize: z.number().positive('Holding Size must be positive'),
  toolCount: z.number().positive('Tool Count must be positive'),
  status: z.nativeEnum(MachineStatus),
});

export type MachineFormData = z.infer<typeof machineSchema>;
