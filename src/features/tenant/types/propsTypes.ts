import type { TenantRequest, TenantUpdateData } from './index';

export type TenantFormProps = {
  onSubmit: (data: TenantRequest) => void;
  loading: boolean;
  error: string | null;
};

export type UpdateTenantFormProps = {
  onSubmit: (data: TenantUpdateData) => void;
  loading: boolean;
  data: string | null;
  error: string | null;
};
