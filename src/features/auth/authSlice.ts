import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./types/authTypes";
import type { AuthUser, LoginResponse } from "./types";
import { loginUser, registerUser, logoutUser, forgotPassword, resetPassword } from "./authThunk";
import type { ApiResponse } from "@/shared/types/apiResponse";
import { setAccessToken } from "@/app/api/axios";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
}


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setAuth: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      setAccessToken(action.payload.token);
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      //Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<ApiResponse<LoginResponse>>) => {
        state.loading = false;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.access_token || null;
        state.isAuthenticated = true;

        setAccessToken(action.payload.data?.access_token || null);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      //Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        setAccessToken(null);
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        setAccessToken(null);
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
})

export const { logout, setInitialized, setAuth, updateUser } = authSlice.actions;

export default authSlice.reducer