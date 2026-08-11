export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface MachinistMachine {
  id: string;
  name: string;
  brand: string;
  status: string;
  shiftJobCompleted: boolean;
}

export interface MaintenanceTicket {
  id: string;
  tenantId: string;
  createdBy: string;
  machineId: string;
  assignedTo: string | null;
  resolvedBy: string | null;
  issue: string;
  description: string | null;
  status: MaintenanceStatus;
  reason: string | null;
  estimatedDurationMinutes: number | null;
  actualDurationMinutes: number | null;
  reportedAt: string;
  assignedAt: string | null;
  resolvedAt: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  machine?: { name: string; brand: string };
  creator?: { name: string; email: string };
  assignee?: { name: string; email: string } | null;
  resolver?: { name: string; email: string } | null;
}

export interface CreateTicketRequest {
  machineId: string;
  issue: string;
  description?: string;
  estimatedDurationMinutes?: number;
}

export interface CloseTicketRequest {
  reason: string;
  actualDurationMinutes?: number;
}

export interface AdminLogsQuery {
  page?: number;
  limit?: number;
  machineId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
