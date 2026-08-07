import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchAdminLogs } from '../maintenanceThunk';
import { machineService } from '@/services/machineService';
import type { Machine } from '@/features/machine/types';
import { Button } from '@/shared/components/ui/button';
import { notifyError } from '@/shared/utils/toasterUtils';
import { clearMaintenanceError } from '../maintenanceSlice';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';
import {
  FileText,
  Calendar,
  Wrench,
  Search,
  RotateCcw,
  Clock,
  User,
  CheckCircle,
} from 'lucide-react';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messages';

const statusColors = {
  OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
  CLOSED: 'bg-green-100 text-green-700 border-green-200',
};

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
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 pb-2 border-b border-gray-50">
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
                // Clear end date if it's now before the new start date
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
        <div className="flex wrap items-center justify-between pt-3 gap-3 border-t border-gray-55">
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
              className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all hover:shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Filter Set
            </button>
          )}
        </div>
      </div>

      {/* Table listing */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[450px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Machine Details</th>
                <th className="py-4 px-6">Breakdown / Issue</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Assigned Personnel</th>
                <th className="py-4 px-6">Timeline Metrics</th>
                <th className="py-4 px-6">Resolution Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {adminLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <FileText className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-semibold text-gray-800">
                        No logs found
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try updating your filters or search fields in the filter
                        panel.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                adminLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/40 transition-colors"
                  >
                    {/* Machine Column */}
                    <td className="py-4.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 font-sans text-sm">
                          {log.machine?.name || '—'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {log.machine?.brand || 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Issue Column */}
                    <td className="py-4.5 px-6 max-w-sm">
                      <div className="space-y-1">
                        <span
                          className="font-semibold text-gray-900 block truncate"
                          title={log.issue}
                        >
                          {log.issue}
                        </span>
                        {log.description && (
                          <span
                            className="text-xs text-gray-400 line-clamp-1 italic font-normal"
                            title={log.description}
                          >
                            "{log.description}"
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4.5 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[log.status]}`}
                      >
                        {log.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Personnel Column */}
                    <td className="py-4.5 px-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <User
                            size={13}
                            className="text-indigo-400 shrink-0"
                          />
                          <span className="text-gray-600">
                            Reporter: <strong>{log.creator?.name}</strong>
                          </span>
                        </div>
                        {log.assignee && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Wrench
                              size={13}
                              className="text-amber-500 shrink-0"
                            />
                            <span className="text-gray-600">
                              Technician: <strong>{log.assignee.name}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Timeline Metrics */}
                    <td className="py-4.5 px-6 text-xs text-gray-500">
                      <div className="space-y-1 flex flex-col font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-gray-300" />
                          Reported:{' '}
                          {new Date(log.reportedAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                            },
                          )}
                        </span>
                        {log.assignedAt && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-amber-400" />
                            Assigned:{' '}
                            {new Date(log.assignedAt).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                              },
                            )}
                          </span>
                        )}
                        {log.resolvedAt && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle size={13} />
                            Closed:{' '}
                            {new Date(log.resolvedAt).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                              },
                            )}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Resolution notes */}
                    <td className="py-4.5 px-6 max-w-xs">
                      {log.status === 'CLOSED' ? (
                        <div className="space-y-1">
                          <p
                            className="text-xs text-gray-700 italic border-l-2 border-emerald-500 pl-2 line-clamp-2"
                            title={log.reason || ''}
                          >
                            {log.reason || 'No resolution message recorded.'}
                          </p>
                          {log.actualDurationMinutes && (
                            <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded">
                              Repaired: {log.actualDurationMinutes} mins
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Pending resolution
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalAdminLogs > pageSize && (
          <div className="flex items-center justify-between border-t border-gray-100 p-5 mt-4">
            <span className="text-xs font-semibold text-gray-500">
              Showing {currentPage * pageSize + 1} to{' '}
              {Math.min((currentPage + 1) * pageSize, totalAdminLogs)} of{' '}
              {totalAdminLogs} logs
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="rounded-lg text-xs"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={(currentPage + 1) * pageSize >= totalAdminLogs}
                className="rounded-lg text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal icon wrapper helper
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
