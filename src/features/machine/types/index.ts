import { MachineType } from '@/shared/types/machine-type.enum';
import { MachineStatus } from '@/shared/types/machine-status.enum';

export interface Machine {
  id: string;
  name: string;
  brand: string;
  maxRpm: number;
  axis: number;
  type: MachineType;
  maxTravelSpeed: number;
  holdingSize: number;
  toolCount: number;
  status: MachineStatus;
  isBlocked: boolean;
  isDeleted: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MachineRequest {
  name: string;
  brand: string;
  maxRpm: number;
  axis: number;
  type: MachineType;
  maxTravelSpeed: number;
  holdingSize: number;
  toolCount: number;
  status: MachineStatus;
}

export interface MachineResponse {
  machines: Machine[];
  total: number;
}
