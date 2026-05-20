import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '@/features/auth/authSlice';
import TenantReducer from '@/features/tenant/tenantSlice';
import SubscriptionReducer from '@/features/subscription/subscriptionSlice';
import MachineReducer from '@/features/machine/machineSlice';

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    tenant: TenantReducer,
    subscription: SubscriptionReducer,
    machine: MachineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
