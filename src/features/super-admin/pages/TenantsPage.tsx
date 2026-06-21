import { useEffect, useState, useCallback } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { superAdminService } from '@/services/superAdminService';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import type { Tenant } from '../types';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import EditNameModal from '@/shared/components/custom/EditNameModal';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';

const columnHelper = createColumnHelper<Tenant>();

const TenantsPage = () => {
  const [data, setData] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [updating, setUpdating] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'blocked'
  >('all');

  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await superAdminService.getAllTenants({
        page: currentPage + 1,
        limit: PAGINATION_LIMIT,
        search: debouncedSearch,
        status: statusFilter,
      });

      const { tenants, total } = res.data?.data || { tenants: [], total: 0 };
      setData(tenants);
      setTotalCount(total);
    } catch {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_FETCH_TENANTS);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, statusFilter]);

  const handleToggleBlock = async (id: string, currentlyBlocked: boolean) => {
    try {
      await superAdminService.toggleTenantBlock(id);
      setData((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isBlocked: !t.isBlocked } : t)),
      );
      notifySuccess(
        currentlyBlocked
          ? FRONTEND_MESSAGE_CONSTANTS.SUCCESS.TENANT_UNBLOCKED
          : FRONTEND_MESSAGE_CONSTANTS.SUCCESS.TENANT_BLOCKED,
      );
    } catch (error: unknown) {
      notifyError(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
    }
  };

  const handleEditName = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  };

  const handleUpdateName = async (newName: string) => {
    if (!selectedTenant) return;

    try {
      setUpdating(true);

      await superAdminService.updateTenantName(selectedTenant.id, newName);

      setData((prev) =>
        prev.map((t) =>
          t.id === selectedTenant.id ? { ...t, name: newName } : t,
        ),
      );

      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.TENANT_NAME_UPDATED);
      setIsModalOpen(false);
      setSelectedTenant(null);
    } catch (error: unknown) {
      notifyError(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_UPDATE_TENANT_NAME,
      );
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div className="font-medium text-gray-900">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('isBlocked', {
      header: 'Status',
      cell: ({ getValue }) => {
        const isBlocked = getValue();
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isBlocked
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {isBlocked ? 'Blocked' : 'Active'}
          </span>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const tenant = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleToggleBlock(tenant.id, tenant.isBlocked)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                tenant.isBlocked
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              {tenant.isBlocked ? 'Unblock' : 'Block'}
            </button>

            <button
              onClick={() => handleEditName(tenant)}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded text-sm font-medium transition-colors"
            >
              Edit
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Button size={'lg'} variant={'primary'} onClick={() => setSearch('')}>
            Clear
          </Button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'all' | 'active' | 'blocked')
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex justify-center items-center bg-white/50 backdrop-blur-[1px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5]"></div>
          </div>
        )}
        <DataTable
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columns as any}
          data={data}
          manualPagination={true}
          pageCount={Math.ceil(totalCount / PAGINATION_LIMIT)}
          pageIndex={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <EditNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdateName}
        defaultValue={selectedTenant?.name || ''}
        loading={updating}
      />
    </div>
  );
};

export default TenantsPage;
