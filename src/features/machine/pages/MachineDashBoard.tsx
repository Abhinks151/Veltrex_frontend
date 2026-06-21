import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchMachines,
  createMachine,
  updateMachine,
  toggleMachineBlock,
  deleteMachine,
} from '../machineThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import MachineForm from '../components/MachineForm';
import type { Machine, MachineRequest } from '../types';
import type { MachineFormData } from '../validators/machineValidator';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper<Machine>();

const MachineDashBoard = () => {
  const dispatch = useAppDispatch();
  const { machines, total, loading } = useAppSelector((state) => state.machine);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
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
      fetchMachines({
        page: currentPage + 1,
        limit: PAGINATION_LIMIT,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  const handleAddMachine = async (data: MachineFormData) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        createMachine(data as MachineRequest),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.MACHINE_CREATED);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.MACHINE_CREATION_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMachine = async (data: MachineFormData) => {
    if (!selectedMachine) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        updateMachine({ id: selectedMachine.id, data: data as MachineRequest }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.MACHINE_UPDATED);
        setIsEditModalOpen(false);
        setSelectedMachine(null);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage || FRONTEND_MESSAGE_CONSTANTS.ERROR.MACHINE_UPDATE_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBlock = useCallback(
    async (machine: Machine) => {
      const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: `Do you want to ${machine.isBlocked ? 'Unblock' : 'Block'} this machine?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${machine.isBlocked ? 'Unblock' : 'Block'} its!`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await dispatch(toggleMachineBlock(machine.id)).unwrap();
          notifySuccess(
            FRONTEND_MESSAGE_CONSTANTS.SUCCESS.MACHINE_BLOCK_TOGGLED,
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
        text: "You won't be able to revert this machine!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          await dispatch(deleteMachine(id)).unwrap();
          notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.MACHINE_DELETED);

          if (machines.length === 1 && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
          } else {
            loadData();
          }
        } catch (error) {
          const errorMessage =
            (error as { message?: string })?.message || (error as string);
          notifyError(errorMessage || 'Failed to delete machine');
        }
      }
    },
    [
      dispatch,
      swalWithBootstrapButtons,
      machines.length,
      currentPage,
      loadData,
    ],
  );

  const columns: ColumnDef<Machine, unknown>[] = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Machine Name',
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {info.getValue() as string}
            </span>
            <span className="text-xs text-gray-500">
              {info.row.original.brand}
            </span>
          </div>
        ),
      }) as ColumnDef<Machine, unknown>,
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium uppercase">
            {info.getValue() as string}
          </span>
        ),
      }) as ColumnDef<Machine, unknown>,
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string;
          const colors: Record<string, string> = {
            IDLE: 'bg-gray-100 text-gray-700',
            RUNNING: 'bg-green-100 text-green-700',
            MAINTENANCE: 'bg-orange-100 text-orange-700',
          };
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors[status] || 'bg-indigo-50 text-indigo-700'}`}
            >
              {status}
            </span>
          );
        },
      }) as ColumnDef<Machine, unknown>,
      columnHelper.accessor('isBlocked', {
        header: 'Availability',
        cell: (info) => {
          const isBlocked = info.getValue() as boolean;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isBlocked
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {isBlocked ? 'Blocked' : 'Active'}
            </span>
          );
        },
      }) as ColumnDef<Machine, unknown>,
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const machine = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedMachine(machine);
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleBlock(machine)}
                className={`h-8 px-3 text-xs font-semibold ${machine.isBlocked ? 'text-green-600' : 'text-orange-600'}`}
              >
                {machine.isBlocked ? 'Unblock' : 'Block'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(machine.id)}
                className="h-8 px-3 text-xs font-semibold text-red-600"
              >
                Delete
              </Button>
            </div>
          );
        },
      }) as ColumnDef<Machine, unknown>,
    ],
    [handleDelete, handleToggleBlock],
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Machine Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure and manage manufacturing units
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Machine</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search machines or brands..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
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
          data={machines}
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
        title="Add New Machine"
        maxWidth="max-w-2xl"
      >
        <MachineForm onSubmit={handleAddMachine} loading={isSubmitting} />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMachine(null);
        }}
        title="Edit Machine"
        maxWidth="max-w-2xl"
      >
        {selectedMachine && (
          <MachineForm
            initialData={
              selectedMachine
                ? (selectedMachine as unknown as MachineFormData)
                : undefined
            }
            onSubmit={handleEditMachine}
            loading={isSubmitting}
          />
        )}
      </ReusableModal>
    </div>
  );
};

export default MachineDashBoard;
