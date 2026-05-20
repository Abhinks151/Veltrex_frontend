import { createSlice } from '@reduxjs/toolkit';
import type { Fixture } from './types';
import {
  fetchFixtures,
  createFixture,
  updateFixture,
  toggleFixtureBlock,
  deleteFixture,
} from './fixtureThunk';

interface FixtureState {
  fixtures: Fixture[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: FixtureState = {
  fixtures: [],
  total: 0,
  loading: false,
  error: null,
};

const fixtureSlice = createSlice({
  name: 'fixture',
  initialState,
  reducers: {
    clearFixtureError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Fixtures
      .addCase(fetchFixtures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFixtures.fulfilled, (state, action) => {
        state.loading = false;
        state.fixtures = action.payload.data?.fixtures || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchFixtures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Fixture
      .addCase(createFixture.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.fixtures.unshift(action.payload.data);
          state.total += 1;
        }
      })
      // Update Fixture
      .addCase(updateFixture.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.fixtures.findIndex(
            (f) => f.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.fixtures[index] = action.payload.data;
          }
        }
      })
      // Toggle Block
      .addCase(toggleFixtureBlock.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.fixtures.findIndex(
            (f) => f.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.fixtures[index] = action.payload.data;
          }
        }
      })
      // Delete Fixture
      .addCase(deleteFixture.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.fixtures = state.fixtures.filter(
            (f) => f.id !== action.payload.data?.id,
          );
          state.total -= 1;
        }
      });
  },
});

export const { clearFixtureError } = fixtureSlice.actions;
export default fixtureSlice.reducer;
