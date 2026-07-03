export interface ProgramVersion {
  id: string;
  tenantId: string;
  programId: string;
  versionNumber: number;
  fileUrl: string;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  description: string | null;
  createdBy: string;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NcProgram {
  id: string;
  tenantId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  versions: ProgramVersion[];
}

export interface NcProgramResponse {
  programs: NcProgram[];
  total: number;
}

export interface CreateNcProgramPayload {
  name: string;
  initialVersion: {
    fileUrl: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    description?: string;
  };
}

export interface AddVersionPayload {
  description?: string;
}
