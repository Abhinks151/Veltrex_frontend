import { createSlice } from '@reduxjs/toolkit';
import type { Employee } from './types';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeBlock,
  deleteEmployee,
} from './employeeThunk';

interface EmployeeState {
  employees: Employee[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  total: 0,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data?.users || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Employee
      .addCase(createEmployee.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.employees.unshift(action.payload.data);
          state.total += 1;
        }
      })
      // Update Employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.employees.findIndex(
            (e) => e.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.employees[index] = action.payload.data;
          }
        }
      })
      // Toggle Block
      .addCase(toggleEmployeeBlock.fulfilled, (state, action) => {
        if (action.payload.data) {
          const index = state.employees.findIndex(
            (e) => e.id === action.payload.data?.id,
          );
          if (index !== -1) {
            state.employees[index] = action.payload.data;
          }
        }
      })
      // Delete Employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.employees = state.employees.filter(
            (e) => e.id !== action.payload.data?.id,
          );
          state.total -= 1;
        }
      });
  },
});

export const { clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;
