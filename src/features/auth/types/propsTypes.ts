import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from "./index";

export type LoginFormProps = {
  onSubmit: (data: LoginRequest) => void;
  loading: boolean;
  error: string | null;
};


export type RegisterFormProps = {
  onSubmit: (data: RegisterRequest) => void;
  loading: boolean;
  error: string | null;
};

export type ForgotPasswordFormProps = {
  onSubmit: (data: ForgotPasswordRequest) => void;
  loading: boolean;
  error: string | null;
};

export type ResetPasswordFormProps = {
  onSubmit: (data: ResetPasswordRequest) => void;
  loading: boolean;
  error: string | null;
};