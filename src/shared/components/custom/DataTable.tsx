import { PAGINATION_LIMIT } from '@/shared/constants/constant';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  manualPagination?: boolean;
}

export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize = PAGINATION_LIMIT,
  onPageChange,
  manualPagination = false,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    manualPagination,
    pageCount,
    state: manualPagination
      ? {
          pagination: {
            pageIndex: pageIndex || 0,
            pageSize: pageSize,
          },
        }
      : undefined,
    onPaginationChange: manualPagination
      ? (updater) => {
          if (onPageChange) {
            const newState =
              typeof updater === 'function'
                ? updater({
                    pageIndex: pageIndex || 0,
                    pageSize: pageSize,
                  })
                : updater;
            onPageChange(newState.pageIndex);
          }
        }
      : undefined,
    initialState: !manualPagination
      ? {
          pagination: {
            pageSize: pageSize,
          },
        }
      : undefined,
  });

  return (
    <div className="w-full">
      <div className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#f8f9fc]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="divide-x divide-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="divide-x divide-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500 text-sm"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount() || 1}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed bg-white"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 border rounded text-sm font-medium disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed bg-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
