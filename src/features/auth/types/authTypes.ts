

export interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

