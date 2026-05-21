export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MACHINIST = 'MACHINIST',
  MAINTENANCE = 'MAINTENANCE',
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRequest {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface EmployeeResponse {
  users: Employee[];
  total: number;
}
