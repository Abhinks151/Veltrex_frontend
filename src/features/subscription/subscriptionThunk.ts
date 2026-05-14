import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "@/shared/types/apiResponse";
import axios from "axios";
import { subscriptionService } from "@/services/subscriptionService";
import { FRONTEND_MESSAGE_CONSTANTS } from "../../shared/constants/messageConstants";
import type { SubscriptionResponse } from "./types";

export const getSubscription = createAsyncThunk<
  ApiResponse<SubscriptionResponse> | null,
  void,
  { rejectValue: string }
>(
  "subscription/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.get();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        return rejectWithValue(
          error.response?.data.message || "Failed to fetch subscription"
        );
      }
      return rejectWithValue(FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG);
    }
  }
);

export const toggleSubscriptionStatus = createAsyncThunk<
  ApiResponse<SubscriptionResponse> | null,
  string,
  { rejectValue: string }
>(
  "subscription/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.toggleStatus(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "Failed to toggle status"
        );
      }
      return rejectWithValue(FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG);
    }
  }
);

