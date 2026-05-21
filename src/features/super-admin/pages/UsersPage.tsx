import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { superAdminService } from '@/services/superAdminService';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import type { User } from '../types';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';

const columnHelper = createColumnHelper<User>();

const UsersPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
      const res = await superAdminService.getAllUsers({
        page: currentPage + 1,
        limit: PAGINATION_LIMIT,
        search: debouncedSearch,
        status: statusFilter,
      });

      const { users, total } = res.data?.data || { users: [], total: 0 };
      setData(users);
      setTotalCount(total);
    } catch {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_FETCH_USERS);
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
      await superAdminService.toggleUserBlock(id);
      setData((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked: !u.isBlocked } : u)),
      );
      notifySuccess(
        currentlyBlocked
          ? FRONTEND_MESSAGE_CONSTANTS.SUCCESS.USER_UNBLOCKED
          : FRONTEND_MESSAGE_CONSTANTS.SUCCESS.USER_BLOCKED,
      );
    } catch (error: unknown) {
      notifyError(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div className="font-medium text-gray-900">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <div className="text-gray-600">{info.getValue()}</div>,
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
          const user = row.original;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  user.isBlocked
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          );
        },
      }),
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search users..."
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
    </div>
  );
};

export default UsersPage;
