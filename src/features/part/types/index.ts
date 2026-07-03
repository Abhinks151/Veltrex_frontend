export enum OperationType {
  MILL = 'MILL',
  LATHE = 'LATHE',
}

export enum PartPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface PartDimensions {
  width: number;
  length: number;
  height: number;
  unit: string;
}

export interface Part {
  id: string;
  tenantId: string;
  name: string;
  partNumber: string;
  description: string | null;
  material: string | null;
  operationType: OperationType | null;
  machineId: string | null;
  fixtureId: string | null;
  rawMaterialId: string | null;
  ncProgramId: string | null;
  dimensions: PartDimensions | null;
  cycleTime: string | null;
  setupTime: string | null;
  setupSheet: string | null;
  setupSheetKey: string | null;
  engineeringDrawing: string | null;
  engineeringDrawingKey: string | null;
  priority: PartPriority;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartRequest {
  name: string;
  partNumber: string;
  description?: string;
  material?: string;
  operationType?: OperationType;
  machineId?: string;
  fixtureId?: string;
  rawMaterialId?: string;
  ncProgramId?: string;
  dimensions?: PartDimensions;
  cycleTime?: string;
  setupTime?: string;
  priority?: PartPriority;
  setupSheet?: File;
  engineeringDrawing?: File;
}

export interface PartResponse {
  items: Part[];
  total: number;
}
