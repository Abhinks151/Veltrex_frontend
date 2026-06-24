import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeBlock,
  deleteEmployee,
} from '../employeeThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, Search, RefreshCcw, Filter } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import EmployeeForm from '../components/EmployeeForm';
import type { Employee, EmployeeRequest } from '../types';
import type {
  EmployeeCreateFormData,
  EmployeeUpdateFormData,
} from '../validators/employeeValidator';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper<Employee>();

const EmployeeDashBoard = () => {
  const dispatch = useAppDispatch();
  const { employees, total, loading } = useAppSelector(
    (state) => state.employee,
  );

  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      actions: 'flex gap-3',
      confirmButton: buttonVariants({
        variant: 'primary',
        size: 'lg',
      }),
      cancelButton: buttonVariants({
        variant: 'destructive',
        size: 'lg',
      }),
    },
    buttonsStyling: false,
  });

  const loadData = useCallback(() => {
    dispatch(
      fetchEmployees({
        page: currentPage + 1,
        limit: pageSize,
        search: debouncedSearch,
        status: statusFilter,
        sort: sortOrder,
      }),
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    debouncedSearch,
    statusFilter,
    sortOrder,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, statusFilter, sortOrder]);

  const handleAddEmployee = async (
    data: EmployeeCreateFormData | EmployeeUpdateFormData,
  ) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        createEmployee(data as EmployeeRequest),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.EMPLOYEE_CREATED);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.EMPLOYEE_CREATION_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = async (
    data: EmployeeCreateFormData | EmployeeUpdateFormData,
  ) => {
    if (!selectedEmployee) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        updateEmployee({
          id: selectedEmployee.id,
          data: data as Partial<EmployeeRequest>,
        }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.EMPLOYEE_UPDATED);
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage || FRONTEND_MESSAGE_CONSTANTS.ERROR.EMPLOYEE_UPDATE_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBlock = useCallback(
    async (employee: Employee) => {
      const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: `Do you want to ${employee.isBlocked ? 'Unblock' : 'Block'} this employee?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${employee.isBlocked ? 'Unblock' : 'Block'} them!`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await dispatch(toggleEmployeeBlock(employee.id)).unwrap();
          notifySuccess(
            FRONTEND_MESSAGE_CONSTANTS.SUCCESS.EMPLOYEE_BLOCK_TOGGLED,
          );
        } catch (error) {
          const errorMessage =
            (error as { message?: string })?.message || (error as string);
          notifyError(errorMessage || 'Failed to update status');
        }
      }
    },
    [dispatch, swalWithBootstrapButtons],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this! This is a soft delete.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await dispatch(deleteEmployee(id)).unwrap();
          notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.EMPLOYEE_DELETED);

          if (employees.length === 1 && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
          } else {
            loadData();
          }
        } catch (error) {
          const errorMessage =
            (error as { message?: string })?.message || (error as string);
          notifyError(errorMessage || 'Failed to delete employee');
        }
      }
    },
    [
      dispatch,
      swalWithBootstrapButtons,
      employees.length,
      currentPage,
      loadData,
    ],
  );

  const columns: ColumnDef<Employee, unknown>[] = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {info.getValue() as string}
            </span>
            <span className="text-xs text-gray-500">
              {info.row.original.email}
            </span>
          </div>
        ),
      }) as ColumnDef<Employee, unknown>,
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => (
          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium uppercase">
            {info.getValue() as string}
          </span>
        ),
      }) as ColumnDef<Employee, unknown>,
      columnHelper.accessor('isBlocked', {
        header: 'Status',
        cell: (info) => {
          const isBlocked = info.getValue() as boolean;
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                isBlocked
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isBlocked ? 'Blocked' : 'Active'}
            </span>
          );
        },
      }) as ColumnDef<Employee, unknown>,
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const employee = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedEmployee(employee);
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleBlock(employee)}
                className={`h-8 px-3 text-xs font-semibold ${employee.isBlocked ? 'text-green-600' : 'text-orange-600'}`}
              >
                {employee.isBlocked ? 'Unblock' : 'Block'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(employee.id)}
                className="h-8 px-3 text-xs font-semibold text-red-600"
              >
                Delete
              </Button>
            </div>
          );
        },
      }) as ColumnDef<Employee, unknown>,
    ],
    [handleDelete, handleToggleBlock],
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Employee Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Employee</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Filter:
            </span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={100}>100 per page</option>
                <option value={10000}>All</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all cursor-pointer hover:bg-gray-100"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-gray-200">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Sort:
            </span>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="appearance-none pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all cursor-pointer hover:bg-gray-100"
              >
                <option value="asc">Name A-Z</option>
                <option value="desc">Name Z-A</option>
              </select>
              <RefreshCcw
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 border-gray-200">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => loadData()}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
          </div>
        )}
        <DataTable
          columns={columns}
          data={employees}
          manualPagination
          pageCount={Math.ceil(total / PAGINATION_LIMIT)}
          pageIndex={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Modal */}
      <ReusableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        maxWidth="max-w-md"
      >
        <EmployeeForm onSubmit={handleAddEmployee} loading={isSubmitting} />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        title="Edit Employee"
        maxWidth="max-w-md"
      >
        {selectedEmployee && (
          <EmployeeForm
            isEdit
            initialData={{
              name: selectedEmployee.name,
              role: selectedEmployee.role,
            }}
            onSubmit={handleEditEmployee}
            loading={isSubmitting}
          />
        )}
      </ReusableModal>
    </div>
  );
};

export default EmployeeDashBoard;
