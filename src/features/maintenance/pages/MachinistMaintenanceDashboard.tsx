import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchMachinistMachines,
  createMaintenanceTicket,
  fetchMachinistTickets,
} from '../maintenanceThunk';
import { Button } from '@/shared/components/ui/button';
import { notifySuccess, notifyError } from '@/shared/utils/toasterUtils';
import { clearMaintenanceError } from '../maintenanceSlice';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  User,
  Activity,
  PlusCircle,
} from 'lucide-react';

const statusColors = {
  OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
  CLOSED: 'bg-green-100 text-green-700 border-green-200',
};

const MachinistMaintenanceDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    machinistMachines,
    machinistTickets,
    totalMachinistTickets,
    loading,
    actionLoading,
    error,
  } = useAppSelector((state) => state.maintenance);

  // Form State
  const [machineId, setMachineId] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);

  const loadData = useCallback(() => {
    dispatch(fetchMachinistMachines());
    dispatch(
      fetchMachinistTickets({
        page: currentPage + 1,
        limit: PAGINATION_LIMIT,
      }),
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (error) {
      notifyError(error);
      dispatch(clearMaintenanceError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineId) {
      notifyError('Please select a machine');
      return;
    }
    if (!issue.trim()) {
      notifyError('Please specify the issue');
      return;
    }

    const payload = {
      machineId,
      issue: issue.trim(),
      description: description.trim() || undefined,
      estimatedDurationMinutes: estimatedDuration
        ? Number(estimatedDuration)
        : undefined,
    };

    const res = await dispatch(createMaintenanceTicket(payload));
    if (createMaintenanceTicket.fulfilled.match(res)) {
      notifySuccess('Maintenance ticket reported successfully!');
      // Reset form
      setMachineId('');
      setIssue('');
      setDescription('');
      setEstimatedDuration('');
      loadData();
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
          <Wrench className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Maintenance Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Report machine issues from your assigned shifts and track their
            resolution status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            <h2 className="font-bold text-lg">Report Malfunction</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Machine *
              </label>
              {machinistMachines.length === 0 ? (
                <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    No machines currently assigned via shift jobs. You cannot
                    file maintenance tickets.
                  </span>
                </div>
              ) : (
                <select
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white font-medium text-gray-800"
                  required
                >
                  <option value="">Select Machine</option>
                  {machinistMachines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.brand}) - {m.status}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Issue Summary *
              </label>
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="e.g., Coolant leak, Spindle vibration"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe what happened, error codes displayed, etc."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium text-gray-800 whitespace-pre-wrap"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Est. Duration (Minutes)
              </label>
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="Optional"
                min="1"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium text-gray-800"
              />
            </div>

            <Button
              type="submit"
              disabled={actionLoading || machinistMachines.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-bold shadow-md hover:shadow-lg transition-all"
            >
              {actionLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </form>
        </div>

        {/* Tickets List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              Your Reported Tickets
            </h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {totalMachinistTickets} Reported
            </span>
          </div>

          <div className="space-y-4 min-h-[400px]">
            {machinistTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-16 text-center text-gray-400">
                <FileText className="h-12 w-12 text-gray-300 mb-3" />
                <p className="font-semibold">
                  No maintenance tickets reported yet
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
                  Any issues you report will show up here to track progress.
                </p>
              </div>
            ) : (
              machinistTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50/50 hover:border-gray-200 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-gray-900 font-sans text-sm">
                          {ticket.machine?.name || 'Unknown'} (
                          {ticket.machine?.brand})
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[ticket.status]}`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {ticket.issue}
                      </h3>
                      {ticket.description && (
                        <p className="text-sm text-gray-500 whitespace-pre-wrap break-words leading-relaxed max-w-xl">
                          {ticket.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 pt-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-gray-300" />
                          Reported:{' '}
                          {new Date(ticket.reportedAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {ticket.estimatedDurationMinutes && (
                          <span className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                            Est: {ticket.estimatedDurationMinutes} mins
                          </span>
                        )}
                        {ticket.actualDurationMinutes && (
                          <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Actual: {ticket.actualDurationMinutes} mins
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Team assigning detail */}
                    <div className="flex flex-col gap-2 shrink-0 sm:text-right">
                      {ticket.status === 'IN_PROGRESS' && ticket.assignee && (
                        <div className="text-xs bg-amber-50 text-amber-700 px-3 py-2 rounded-xl border border-amber-100 flex items-center sm:justify-end gap-1.5 font-medium">
                          <User className="h-3.5 w-3.5" />
                          <span>
                            Assigned to: <strong>{ticket.assignee.name}</strong>
                          </span>
                        </div>
                      )}
                      {ticket.status === 'CLOSED' && (
                        <div className="text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-100 flex flex-col sm:items-end gap-1 font-medium">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            <span>
                              Resolved by:{' '}
                              <strong>{ticket.resolver?.name}</strong>
                            </span>
                          </div>
                          {ticket.reason && (
                            <span
                              className="text-[10px] text-gray-500 font-normal italic mt-1 max-w-[200px] truncate block"
                              title={ticket.reason}
                            >
                              "{ticket.reason}"
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalMachinistTickets > PAGINATION_LIMIT && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
              <span className="text-xs font-semibold text-gray-500">
                Page {currentPage + 1} of{' '}
                {Math.ceil(totalMachinistTickets / PAGINATION_LIMIT)}
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
                  disabled={
                    (currentPage + 1) * PAGINATION_LIMIT >=
                    totalMachinistTickets
                  }
                  className="rounded-lg text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachinistMaintenanceDashboard;
