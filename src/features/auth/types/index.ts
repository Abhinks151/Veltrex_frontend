export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImage: string;
}

export interface LoginResponse {
  user: AuthUser;
  access_token: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface LoginResponse {
  user: AuthUser;
  access_token: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
  resetLink?: string;
}

export interface ResetPasswordRequest {
  password: string;
}
