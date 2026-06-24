import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchParts,
  createPart,
  updatePart,
  togglePartBlock,
  deletePart,
} from '../partThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, Search, RefreshCcw, ExternalLink } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import PartForm from '../components/PartForm';
import type { Part } from '../types';
import { PartPriority } from '../types';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper<Part>();

const PRIORITY_COLORS: Record<PartPriority, string> = {
  [PartPriority.LOW]: 'bg-gray-100 text-gray-700',
  [PartPriority.MEDIUM]: 'bg-blue-100 text-blue-700',
  [PartPriority.HIGH]: 'bg-orange-100 text-orange-700',
  [PartPriority.URGENT]: 'bg-red-100 text-red-700',
};

const PartDashBoard = () => {
  const dispatch = useAppDispatch();
  const { parts, total, loading } = useAppSelector((state) => state.part);

  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      actions: 'flex gap-3',
      confirmButton: buttonVariants({ variant: 'primary', size: 'lg' }),
      cancelButton: buttonVariants({ variant: 'destructive', size: 'lg' }),
    },
    buttonsStyling: false,
  });

  const loadData = useCallback(() => {
    dispatch(
      fetchParts({
        page: currentPage + 1,
        limit: pageSize,
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
      }),
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    debouncedSearch,
    statusFilter,
    priorityFilter,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, statusFilter, priorityFilter]);

  const handleAddPart = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(createPart(formData)).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PART_CREATED);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      const msg = (error as { message?: string })?.message || (error as string);
      notifyError(msg || FRONTEND_MESSAGE_CONSTANTS.ERROR.PART_CREATION_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPart = async (formData: FormData) => {
    if (!selectedPart) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        updatePart({ id: selectedPart.id, data: formData }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PART_UPDATED);
        setIsEditModalOpen(false);
        setSelectedPart(null);
      }
    } catch (error) {
      const msg = (error as { message?: string })?.message || (error as string);
      notifyError(msg || FRONTEND_MESSAGE_CONSTANTS.ERROR.PART_UPDATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBlock = async (part: Part) => {
    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `Do you want to ${part.isBlocked ? 'Unblock' : 'Block'} this part?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${part.isBlocked ? 'Unblock' : 'Block'} it!`,
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(togglePartBlock(part.id)).unwrap();
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PART_BLOCK_TOGGLED);
      } catch (error) {
        const msg =
          (error as { message?: string })?.message || (error as string);
        notifyError(msg || 'Failed to update part status');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this part!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deletePart(id)).unwrap();
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PART_DELETED);
        if (parts.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          loadData();
        }
      } catch (error) {
        const msg =
          (error as { message?: string })?.message || (error as string);
        notifyError(msg || 'Failed to delete part');
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Part Name',
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {info.getValue()}
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">
              {info.row.original.partNumber}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('material', {
        header: 'Material',
        cell: (info) => (
          <span className="text-gray-600 text-sm">
            {info.getValue() ?? '—'}
          </span>
        ),
      }),
      columnHelper.accessor('operationType', {
        header: 'Operation',
        cell: (info) => {
          const val = info.getValue();
          return val ? (
            <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium uppercase">
              {val}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          );
        },
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => {
          const val = info.getValue();
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[val]}`}
            >
              {val}
            </span>
          );
        },
      }),
      columnHelper.accessor('setupSheet', {
        header: 'Setup Sheet',
        cell: (info) => {
          const url = info.getValue();
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#4f46e5] text-xs hover:underline"
            >
              <ExternalLink size={12} />
              View PDF
            </a>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          );
        },
      }),
      columnHelper.accessor('engineeringDrawing', {
        header: 'Eng. Drawing',
        cell: (info) => {
          const url = info.getValue();
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#4f46e5] text-xs hover:underline"
            >
              <ExternalLink size={12} />
              View PDF
            </a>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          );
        },
      }),
      columnHelper.accessor('isBlocked', {
        header: 'Status',
        cell: (info) => {
          const isBlocked = info.getValue();
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
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const part = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedPart(part);
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleBlock(part)}
                className={`h-8 px-3 text-xs font-semibold ${part.isBlocked ? 'text-green-600' : 'text-orange-600'}`}
              >
                {part.isBlocked ? 'Unblock' : 'Block'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(part.id)}
                className="h-8 px-3 text-xs font-semibold text-red-600"
              >
                Delete
              </Button>
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Part Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage parts and their associated documents
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Part</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or part number..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}

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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5] bg-white"
          >
            <option value="all">All Priority</option>
            {Object.values(PartPriority).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
          </div>
        )}
        <DataTable
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columns as unknown as any[]}
          data={parts}
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
        title="Add New Part"
        maxWidth="max-w-3xl"
      >
        <PartForm onSubmit={handleAddPart} loading={isSubmitting} />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPart(null);
        }}
        title="Edit Part"
        maxWidth="max-w-3xl"
      >
        {selectedPart && (
          <PartForm
            initialData={selectedPart}
            onSubmit={handleEditPart}
            loading={isSubmitting}
          />
        )}
      </ReusableModal>
    </div>
  );
};

export default PartDashBoard;
