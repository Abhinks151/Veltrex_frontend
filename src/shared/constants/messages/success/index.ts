import { AUTH_SUCCESS } from './auth.success';
import { TENANT_SUCCESS } from './tenant.success';
import { MACHINE_SUCCESS } from './machine.success';
import { FIXTURE_SUCCESS } from './fixture.success';
import { EMPLOYEE_SUCCESS } from './employee.success';
import { SUBSCRIPTION_SUCCESS } from './subscription.success';
import { RAW_MATERIAL_SUCCESS } from './raw-material.success';
import { JOB_SUCCESS } from './job.success';
import { PART_SUCCESS } from './part.success';
import { SHIFT_SUCCESS } from './shift.success';
import { NC_PROGRAM_SUCCESS } from './nc-program.success';

export const SUCCESS_MESSAGES = {
  ...AUTH_SUCCESS,
  ...TENANT_SUCCESS,
  ...MACHINE_SUCCESS,
  ...FIXTURE_SUCCESS,
  ...EMPLOYEE_SUCCESS,
  ...SUBSCRIPTION_SUCCESS,
  ...RAW_MATERIAL_SUCCESS,
  ...JOB_SUCCESS,
  ...PART_SUCCESS,
  ...SHIFT_SUCCESS,
  ...NC_PROGRAM_SUCCESS,
} as const;

export {
  AUTH_SUCCESS,
  TENANT_SUCCESS,
  MACHINE_SUCCESS,
  FIXTURE_SUCCESS,
  EMPLOYEE_SUCCESS,
  SUBSCRIPTION_SUCCESS,
  RAW_MATERIAL_SUCCESS,
  JOB_SUCCESS,
  PART_SUCCESS,
  SHIFT_SUCCESS,
  NC_PROGRAM_SUCCESS,
};
