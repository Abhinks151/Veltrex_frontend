export enum ShiftType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

export enum ShiftRepeatType {
  NONE = 'NONE',
  DAILY = 'DAILY',
}

export enum ShiftStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum ShiftJobStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface ShiftTemplateJob {
  id: string;
  jobId: string;
  shiftTemplateId: string;
  assignedQuantity: number;
  sequence: number;
  job?: {
    id: string;
    part?: { name: string; partNumber: string };
    quantity: number;
    status: string;
  };
}

export interface ShiftTemplate {
  id: string;
  tenantId: string;
  employeeId: string;
  shiftType: ShiftType;
  repeatType: ShiftRepeatType;
  startDate: string;
  endDate?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  employee?: { name: string; email: string };
  templateJobs?: ShiftTemplateJob[];
}

export interface ShiftJob {
  id: string;
  tenantId: string;
  productionShiftId: string;
  jobId: string;
  assignedQuantity: number;
  completedQuantity: number;
  sequence: number;
  status: ShiftJobStatus;
  job?: {
    id: string;
    partId: string;
    part?: { name: string; partNumber: string };
    quantity: number;
  };
}

export interface ProductionShift {
  id: string;
  tenantId: string;
  shiftTemplateId?: string;
  employeeId: string;
  date: string;
  shiftType: ShiftType;
  status: ShiftStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  employee?: { name: string; email: string };
  shiftJobs?: ShiftJob[];
}

export interface CreateShiftTemplateRequest {
  employeeId: string;
  shiftType: ShiftType;
  repeatType: ShiftRepeatType;
  startDate: string;
  endDate?: string;
  jobs: {
    jobId: string;
    assignedQuantity: number;
    sequence: number;
  }[];
}
