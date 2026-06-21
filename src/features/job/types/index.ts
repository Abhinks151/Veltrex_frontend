export enum JobPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum JobStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Job {
  id: string;
  tenantId: string;
  partId: string;
  quantity: number;
  priority: JobPriority;
  repeat: boolean;
  status: JobStatus;
  createdByUserId: string;
  assignedToUserId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobRequest {
  partId: string;
  quantity: number;
  priority: JobPriority;
  repeat?: boolean;
  assignedToUserId?: string | null;
  status?: JobStatus;
}
