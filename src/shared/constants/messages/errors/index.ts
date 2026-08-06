import { AUTH_ERRORS } from './auth.errors';
import { TENANT_ERRORS } from './tenant.errors';
import { MACHINE_ERRORS } from './machine.errors';
import { FIXTURE_ERRORS } from './fixture.errors';
import { RAW_MATERIAL_ERRORS } from './raw-material.errors';
import { EMPLOYEE_ERRORS } from './employee.errors';
import { JOB_ERRORS } from './job.errors';
import { PART_ERRORS } from './part.errors';
import { SUBSCRIPTION_ERRORS } from './subscription.errors';
import { NC_PROGRAM_ERRORS } from './nc-program.errors';
import { SHIFT_ERRORS } from './shift.errors';
import { SUPER_ADMIN_ERRORS } from './super-admin.errors';
import { MAINTENANCE_ERRORS } from './maintenance.errors';

export const ERROR_MESSAGES = {
  ...AUTH_ERRORS,
  ...TENANT_ERRORS,
  ...MACHINE_ERRORS,
  ...FIXTURE_ERRORS,
  ...RAW_MATERIAL_ERRORS,
  ...EMPLOYEE_ERRORS,
  ...JOB_ERRORS,
  ...PART_ERRORS,
  ...SUBSCRIPTION_ERRORS,
  ...NC_PROGRAM_ERRORS,
  ...SHIFT_ERRORS,
  ...SUPER_ADMIN_ERRORS,
  ...MAINTENANCE_ERRORS,
} as const;

export {
  AUTH_ERRORS,
  TENANT_ERRORS,
  MACHINE_ERRORS,
  FIXTURE_ERRORS,
  RAW_MATERIAL_ERRORS,
  EMPLOYEE_ERRORS,
  JOB_ERRORS,
  PART_ERRORS,
  SUBSCRIPTION_ERRORS,
  NC_PROGRAM_ERRORS,
  SHIFT_ERRORS,
  SUPER_ADMIN_ERRORS,
  MAINTENANCE_ERRORS,
};
