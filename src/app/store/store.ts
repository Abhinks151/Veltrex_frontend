import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '@/features/auth/authSlice';
import TenantReducer from '@/features/tenant/tenantSlice';
import SubscriptionReducer from '@/features/subscription/subscriptionSlice';
import MachineReducer from '@/features/machine/machineSlice';
import FixtureReducer from '@/features/fixture/fixtureSlice';
import RawMaterialReducer from '@/features/raw-material/rawMaterialSlice';
import EmployeeReducer from '@/features/employee/employeeSlice';
import JobReducer from '@/features/job/jobSlice';

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    tenant: TenantReducer,
    subscription: SubscriptionReducer,
    machine: MachineReducer,
    fixture: FixtureReducer,
    rawMaterial: RawMaterialReducer,
    employee: EmployeeReducer,
    job: JobReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
