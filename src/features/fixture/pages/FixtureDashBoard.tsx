import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchFixtures,
  createFixture,
  updateFixture,
  toggleFixtureBlock,
  deleteFixture,
} from '../fixtureThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, Search, RefreshCcw } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import FixtureForm from '../components/FixtureForm';
import type { Fixture, FixtureRequest } from '../types';
import type { FixtureFormData } from '../validators/fixtureValidator';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper<Fixture>();

const FixtureDashBoard = () => {
  const dispatch = useAppDispatch();
  const { fixtures, total, loading } = useAppSelector((state) => state.fixture);

  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
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
      fetchFixtures({
        page: currentPage + 1,
        limit: pageSize,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, pageSize, currentPage, debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset to page 0 on search change
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  const handleAddFixture = async (data: FixtureFormData) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        createFixture(data as FixtureRequest),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.FIXTURE_CREATED);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.FIXTURE_CREATION_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFixture = async (data: FixtureFormData) => {
    if (!selectedFixture) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        updateFixture({ id: selectedFixture.id, data: data as FixtureRequest }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.FIXTURE_UPDATED);
        setIsEditModalOpen(false);
        setSelectedFixture(null);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage || FRONTEND_MESSAGE_CONSTANTS.ERROR.FIXTURE_UPDATE_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBlock = async (fixture: Fixture) => {
    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `Do you want to ${fixture.isBlocked ? 'Unblock' : 'Block'} this fixture?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${fixture.isBlocked ? 'Unblock' : 'Block'} its!`,
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(toggleFixtureBlock(fixture.id)).unwrap();
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.FIXTURE_BLOCK_TOGGLED);
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
      text: "You won't be able to revert this fixture!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteFixture(id)).unwrap();
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.FIXTURE_DELETED);

        if (fixtures.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          loadData();
        }
      } catch (error) {
        const errorMessage =
          (error as { message?: string })?.message || (error as string);
        notifyError(errorMessage || 'Failed to delete fixture');
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Fixture Name',
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium uppercase">
            {info.getValue()}
          </span>
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
          const fixture = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedFixture(fixture);
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleToggleBlock(fixture)}
                className={`h-8 px-3 text-xs font-semibold ${fixture.isBlocked ? 'text-green-600' : 'text-orange-600'}`}
              >
                {fixture.isBlocked ? 'Unblock' : 'Block'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(fixture.id)}
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
            Fixture Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure and manage workholding fixtures
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Fixture</span>
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
            placeholder="Search fixtures..."
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
          columns={columns as unknown as any[]}
          data={fixtures}
          manualPagination
          pageCount={Math.ceil(total / pageSize)}
          pageIndex={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Modal */}
      <ReusableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Fixture"
        maxWidth="max-w-2xl"
      >
        <FixtureForm onSubmit={handleAddFixture} loading={isSubmitting} />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFixture(null);
        }}
        title="Edit Fixture"
        maxWidth="max-w-2xl"
      >
        {selectedFixture && (
          <FixtureForm
            initialData={
              selectedFixture
                ? (selectedFixture as unknown as FixtureFormData)
                : undefined
            }
            onSubmit={handleEditFixture}
            loading={isSubmitting}
          />
        )}
      </ReusableModal>
    </div>
  );
};

export default FixtureDashBoard;
