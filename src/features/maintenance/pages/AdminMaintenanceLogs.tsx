import { useCallback, useEffect, useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAdminLogs } from '../maintenanceThunk';
import { machineService } from '@/services/machineService';
import type { Machine } from '@/features/machine/types';
import { Button } from '@/shared/components/ui/button';
import { notifyError } from '@/shared/utils/toasterUtils';
import { clearMaintenanceError } from '../maintenanceSlice';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';
import { DataTable } from '@/shared/components/custom/DataTable';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import type { MaintenanceTicket } from '../types';
import {
  Calendar,
  Wrench,
  Search,
  RotateCcw,
  Clock,
  User,
  CheckCircle,
} from 'lucide-react';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messages';

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
  CLOSED: 'bg-green-100 text-green-700 border-green-200',
};

const columnHelper = createColumnHelper<MaintenanceTicket>();

const AdminMaintenanceLogs = () => {
  const dispatch = useAppDispatch();
  const { adminLogs, totalAdminLogs, loading, error } = useAppSelector(
    (state) => state.maintenance,
  );

  // States
  const [machines, setMachines] = useState<Machine[]>([]);
  const [machineId, setMachineId] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);

  // Modal State
  const [selectedTicket, setSelectedTicket] =
    useState<MaintenanceTicket | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch machines for filter list
  useEffect(() => {
    machineService
      .getActive()
      .then((res) => {
        if (res.data?.data) {
          setMachines(res.data.data);
        }
      })
      .catch(() => {
        console.error('Failed to load active machines for filtering options');
      });
  }, []);

  const loadLogs = useCallback(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      notifyError(
        FRONTEND_MESSAGE_CONSTANTS.ERROR.END_DATE_CANNOT_BE_BEFORE_START_DATE,
      );
      return;
    }
    dispatch(
      fetchAdminLogs({
        page: currentPage + 1,
        limit: pageSize,
        machineId: machineId || undefined,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
    );
  }, [dispatch, currentPage, pageSize, machineId, status, startDate, endDate]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (error) {
      notifyError(error);
      dispatch(clearMaintenanceError());
    }
  }, [error, dispatch]);

  const handleResetFilters = () => {
    setMachineId('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  // Define Columns for the DataTable helper
  const columns = useMemo(
    () => [
      columnHelper.accessor('machine.name', {
        header: 'Machine Details',
        cell: (info) => {
          const log = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-sm">
                {log.machine?.name || '—'}
              </span>
              <span className="text-xs text-gray-400">
                {log.machine?.brand || 'Unknown'}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('issue', {
        header: 'Breakdown / Issue',
        cell: (info) => {
          const log = info.row.original;
          return (
            <div className="flex flex-col max-w-sm">
              <span
                className="font-semibold text-gray-900 truncate"
                title={log.issue}
              >
                {log.issue}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const ticketStatus = info.getValue();
          return (
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[ticketStatus]}`}
            >
              {ticketStatus.replace('_', ' ')}
            </span>
          );
        },
      }),
      columnHelper.accessor('reportedAt', {
        header: 'Reported Date',
        cell: (info) => {
          const reported = info.getValue();
          return (
            <span className="text-gray-600 text-sm">
              {new Date(reported).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: (info) => {
          const log = info.row.original;
          return (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedTicket(log);
                setIsDetailsModalOpen(true);
              }}
              className="h-8 px-3 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              View
            </Button>
          );
        },
      }),
    ],

    [],
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
            <ClipboardListIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Maintenance Audit Logs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Analyze historic machine failures, filter tickets, and oversee
              resolution metrics.
            </p>
          </div>
        </div>
        <Button
          onClick={loadLogs}
          variant="secondary"
          className="flex items-center gap-2 border border-gray-200"
        >
          <RotateCcw className="h-4 w-4" />
          Refresh Registry
        </Button>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 pb-2 border-b border-gray-55">
          <Search className="h-4 w-4 text-indigo-500" />
          <span>Search & Filter Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Machine Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              Select Machine
            </label>
            <select
              value={machineId}
              onChange={(e) => {
                setMachineId(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800 bg-white"
            >
              <option value="">All Machines</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.brand})
                </option>
              ))}
            </select>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Date range starts */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const newStart = e.target.value;
                setStartDate(newStart);
                if (
                  endDate &&
                  newStart &&
                  new Date(endDate) < new Date(newStart)
                ) {
                  setEndDate('');
                }
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800 bg-white"
            />
          </div>

          {/* Date range ends */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800 bg-white"
            />
          </div>
        </div>

        {/* Clear filter buttons and page limits */}
        <div className="flex items-center justify-between pt-3 gap-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white focus:outline-none"
            >
              <option value={10}>10 Rows</option>
              <option value={25}>25 Rows</option>
              <option value={50}>50 Rows</option>
            </select>
          </div>

          {(machineId || status || startDate || endDate) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all hover:shadow-xs cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Filter Set
            </button>
          )}
        </div>
      </div>

      {/* DataTable Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center animate-fade-in">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        )}

        <DataTable
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columns as unknown as any[]}
          data={adminLogs}
          manualPagination
          pageCount={Math.ceil(totalAdminLogs / pageSize)}
          pageIndex={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Ticket Details Modal */}
      <ReusableModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTicket(null);
        }}
        title="Maintenance Ticket Audit Log Details"
        maxWidth="max-w-2xl"
      >
        {selectedTicket && (
          <div className="space-y-6 text-gray-700">
            {/* Header section with machine and status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Machine Details
                </span>
                <h3 className="text-lg font-bold text-[#1e1b4b]">
                  {selectedTicket.machine?.name || '—'}
                  {selectedTicket.machine?.brand && (
                    <span className="text-gray-400 font-semibold ml-2 text-sm">
                      ({selectedTicket.machine.brand})
                    </span>
                  )}
                </h3>
              </div>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColors[selectedTicket.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                >
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Issue & Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Breakdown Issue
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">
                  {selectedTicket.issue}
                </p>
                {selectedTicket.description ? (
                  <p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">
                    {selectedTicket.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-2 italic">
                    No detailed description provided.
                  </p>
                )}
              </div>
            </div>

            {/* Personnel & Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personnel */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Associated Personnel
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-indigo-500 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400">
                        REPORTED BY
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {selectedTicket.creator?.name || '—'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedTicket.creator?.email || ''}
                      </p>
                    </div>
                  </div>

                  {selectedTicket.assignee && (
                    <div className="flex items-start gap-2.5">
                      <Wrench className="w-4 h-4 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400">
                          ASSIGNED TECHNICIAN
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedTicket.assignee.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedTicket.assignee.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTicket.resolver && (
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400">
                          RESOLVED BY
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedTicket.resolver.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedTicket.resolver.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timelines */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Timeline Dates
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400">
                        REPORTED AT
                      </p>
                      <p className="text-xs font-semibold text-gray-800">
                        {new Date(selectedTicket.reportedAt).toLocaleString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedTicket.assignedAt && (
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400">
                          ASSIGNED AT
                        </p>
                        <p className="text-xs font-semibold text-gray-800">
                          {new Date(selectedTicket.assignedAt).toLocaleString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTicket.resolvedAt && (
                    <div className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400">
                          RESOLVED AT
                        </p>
                        <p className="text-xs font-semibold text-gray-800">
                          {new Date(selectedTicket.resolvedAt).toLocaleString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution specifics & notes */}
            {selectedTicket.status === 'CLOSED' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Resolution Notes
                    </h4>
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-xs text-gray-700 italic">
                      {selectedTicket.reason ||
                        'No resolution message recorded.'}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Work Duration
                    </h4>
                    <div className="flex flex-col gap-2">
                      {selectedTicket.estimatedDurationMinutes !== null && (
                        <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                          <span>Estimated Time:</span>
                          <span className="font-bold">
                            {selectedTicket.estimatedDurationMinutes} mins
                          </span>
                        </div>
                      )}
                      {selectedTicket.actualDurationMinutes !== null && (
                        <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                          <span>Actual Repair Time:</span>
                          <span className="font-bold">
                            {selectedTicket.actualDurationMinutes} mins
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedTicket(null);
                }}
                className="w-full sm:w-auto font-semibold"
              >
                Close View
              </Button>
            </div>
          </div>
        )}
      </ReusableModal>
    </div>
  );
};

// Clipboard list icon helper
const ClipboardListIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
    <path d="M9 8h6" />
  </svg>
);

export default AdminMaintenanceLogs;
