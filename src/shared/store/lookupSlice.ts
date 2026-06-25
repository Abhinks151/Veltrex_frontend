import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { lookupService, type LookupValue } from '@/services/lookupService';

interface LookupState {
  data: Record<string, LookupValue[]>;
  loading: boolean;
  error: string | null;
  fetchedAll: boolean;
}

const initialState: LookupState = {
  data: {},
  loading: false,
  error: null,
  fetchedAll: false,
};

export const fetchAllLookups = createAsyncThunk(
  'lookups/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await lookupService.getAll();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch lookups',
      );
    }
  },
);

const lookupSlice = createSlice({
  name: 'lookups',
  initialState,
  reducers: {
    clearLookups: (state) => {
      state.data = {};
      state.fetchedAll = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLookups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllLookups.fulfilled,
        (state, action: PayloadAction<Record<string, LookupValue[]>>) => {
          state.loading = false;
          state.data = action.payload;
          state.fetchedAll = true;
        },
      )
      .addCase(fetchAllLookups.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An error occurred';
      });
  },
});

export const { clearLookups } = lookupSlice.actions;
export default lookupSlice.reducer;
