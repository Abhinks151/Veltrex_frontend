import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  toggleRawMaterialBlock,
  deleteRawMaterial,
} from '../rawMaterialThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import RawMaterialForm from '../components/RawMaterialForm';
import type { RawMaterial, RawMaterialRequest } from '../types';
import type { RawMaterialFormData } from '../validators/rawMaterialValidator';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper<RawMaterial>();

const RawMaterialDashBoard = () => {
  const dispatch = useAppDispatch();
  const { rawMaterials, total, loading } = useAppSelector(
    (state) => state.rawMaterial,
  );

  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] =
    useState<RawMaterial | null>(null);
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
      fetchRawMaterials({
        page: currentPage + 1,
        limit: pageSize,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, pageSize, currentPage, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  const handleAddRawMaterial = async (data: RawMaterialFormData) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        createRawMaterial(data as RawMaterialRequest),
      ).unwrap();
      if (result.success) {
        notifySuccess(
          FRONTEND_MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_CREATED ||
            'Raw material created successfully',
        );
        setIsAddModalOpen(false);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(errorMessage || 'Failed to create raw material');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRawMaterial = async (data: RawMaterialFormData) => {
    if (!selectedRawMaterial) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        updateRawMaterial({
          id: selectedRawMaterial.id,
          data: data as RawMaterialRequest,
        }),
      ).unwrap();
      if (result.success) {
        notifySuccess(
          FRONTEND_MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_UPDATED ||
            'Raw material updated successfully',
        );
        setIsEditModalOpen(false);
        setSelectedRawMaterial(null);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(errorMessage || 'Failed to update raw material');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBlock = async (rm: RawMaterial) => {
    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `Do you want to ${rm.isBlocked ? 'Unblock' : 'Block'} this raw material?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${rm.isBlocked ? 'Unblock' : 'Block'} it!`,
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(toggleRawMaterialBlock(rm.id)).unwrap();
        notifySuccess(
          FRONTEND_MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_BLOCK_TOGGLED ||
            'Raw material block status updated',
        );
      } catch (error) {
        const errorMessage =
          (error as { message?: string })?.message || (error as string);
        notifyError(errorMessage || 'Failed to update status');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this raw material!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteRawMaterial(id)).unwrap();
        notifySuccess(
          FRONTEND_MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_DELETED ||
            'Raw material deleted successfully',
        );

        if (rawMaterials.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          loadData();
        }
      } catch (error) {
        const errorMessage =
          (error as { message?: string })?.message || (error as string);
        notifyError(errorMessage || 'Failed to delete raw material');
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Material Name',
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {info.getValue()}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {info.row.original.material}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('minQty', {
        header: 'Min Qty',
        cell: (info) => (
          <span className="text-gray-700 font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('dimensions', {
        header: 'Dimensions',
        cell: (info) => {
          const dim = info.getValue();
          return (
            <span className="text-gray-600 text-sm">
              {dim.width} x {dim.length} x {dim.height} {dim.unit}
            </span>
          );
        },
      }),
      columnHelper.accessor('isBlocked', {
        header: 'Availability',
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
          const rm = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedRawMaterial(rm);
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleBlock(rm)}
                className={`h-8 px-3 text-xs font-semibold ${rm.isBlocked ? 'text-green-600' : 'text-orange-600'}`}
              >
                {rm.isBlocked ? 'Unblock' : 'Block'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(rm.id)}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Raw Material Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage inventory and specifications for raw materials
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Material</span>
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
            placeholder="Search materials..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columns as any[]}
          data={rawMaterials}
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
        title="Add New Raw Material"
        maxWidth="max-w-2xl"
      >
        <RawMaterialForm
          onSubmit={handleAddRawMaterial}
          loading={isSubmitting}
        />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRawMaterial(null);
        }}
        title="Edit Raw Material"
        maxWidth="max-w-2xl"
      >
        {selectedRawMaterial && (
          <RawMaterialForm
            initialData={
              selectedRawMaterial
                ? (selectedRawMaterial as unknown as RawMaterialFormData)
                : undefined
            }
            onSubmit={handleEditRawMaterial}
            loading={isSubmitting}
          />
        )}
      </ReusableModal>
    </div>
  );
};

export default RawMaterialDashBoard;
