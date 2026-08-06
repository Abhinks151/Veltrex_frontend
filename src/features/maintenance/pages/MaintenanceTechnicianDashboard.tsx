import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchOpenTickets,
  fetchMyTickets,
  assignTicket,
  releaseTicket,
  closeTicket,
} from '../maintenanceThunk';
import { Button } from '@/shared/components/ui/button';
import { notifySuccess, notifyError } from '@/shared/utils/toasterUtils';
import { clearMaintenanceError } from '../maintenanceSlice';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';
import {
  ClipboardList,
  UserCheck,
  MapPin,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  FileCheck,
  User,
  X,
} from 'lucide-react';

const MaintenanceTechnicianDashboard = () => {
  const dispatch = useAppDispatch();
  const {
    openTickets,
    totalOpenTickets,
    myTickets,
    totalMyTickets,
    loading,
    actionLoading,
    error,
  } = useAppSelector((state) => state.maintenance);

  const [activeTab, setActiveTab] = useState<'open' | 'mine'>('open');
  const [currentPage, setCurrentPage] = useState(0);

  // Close Ticket Modal Form State
  const [closingTicketId, setClosingTicketId] = useState<string | null>(null);
  const [resolutionReason, setResolutionReason] = useState('');
  const [actualDuration, setActualDuration] = useState('');

  const loadData = useCallback(() => {
    if (activeTab === 'open') {
      dispatch(
        fetchOpenTickets({ page: currentPage + 1, limit: PAGINATION_LIMIT }),
      );
    } else {
      dispatch(
        fetchMyTickets({ page: currentPage + 1, limit: PAGINATION_LIMIT }),
      );
    }
  }, [dispatch, activeTab, currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (error) {
      notifyError(error);
      dispatch(clearMaintenanceError());
    }
  }, [error, dispatch]);

  const handleTabChange = (tab: 'open' | 'mine') => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleAssign = async (id: string) => {
    const res = await dispatch(assignTicket(id));
    if (assignTicket.fulfilled.match(res)) {
      notifySuccess('Ticket assigned to you successfully!');
      loadData();
    }
  };

  const handleRelease = async (id: string) => {
    const res = await dispatch(releaseTicket(id));
    if (releaseTicket.fulfilled.match(res)) {
      notifySuccess('Ticket released back to the queue.');
      loadData();
    }
  };

  const handleCloseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingTicketId) return;

    if (resolutionReason.trim().length < 5) {
      notifyError('Please write a resolution summary (at least 5 characters).');
      return;
    }

    const payload = {
      reason: resolutionReason.trim(),
      actualDurationMinutes: actualDuration
        ? Number(actualDuration)
        : undefined,
    };

    const res = await dispatch(
      closeTicket({
        id: closingTicketId,
        data: payload,
      }),
    );

    if (closeTicket.fulfilled.match(res)) {
      notifySuccess('Ticket closed and machine marked as Idle successfully!');
      // Reset Modal Form
      setClosingTicketId(null);
      setResolutionReason('');
      setActualDuration('');
      loadData();
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-white shadow-md">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Maintenance Operations
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Claim new machine breakdown requests, manage your active tasks, and
            record repair details.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleTabChange('open')}
          className={`flex items-center gap-2 py-4 px-6 font-bold text-sm tracking-wide transition-all border-b-2 outline-none -mb-px ${
            activeTab === 'open'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Queue / Open Jobs
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'open'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {totalOpenTickets}
          </span>
        </button>
        <button
          onClick={() => handleTabChange('mine')}
          className={`flex items-center gap-2 py-4 px-6 font-bold text-sm tracking-wide transition-all border-b-2 outline-none -mb-px ${
            activeTab === 'mine'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          My Active Tickets
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'mine'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {totalMyTickets}
          </span>
        </button>
      </div>

      {/* Grid List */}
      <div className="relative min-h-[450px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
            <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'open' ? (
            openTickets.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-16 text-center text-gray-400">
                <FileCheck className="h-12 w-12 text-gray-300 mb-3" />
                <p className="font-semibold">
                  Queue is clear! (No open tickets)
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
                  Breakdowns reported by machinists will appear here instantly.
                </p>
              </div>
            ) : (
              openTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {t.machine?.name} ({t.machine?.brand})
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        OPEN UNIT
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-base leading-snug">
                      {t.issue}
                    </h3>

                    {t.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {t.description}
                      </p>
                    )}

                    <div className="h-px bg-gray-50 pt-2" />

                    <div className="flex flex-col gap-1.5 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-300" />
                        Reported:{' '}
                        {new Date(t.reportedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {t.estimatedDurationMinutes && (
                        <span className="flex items-center gap-1.5 text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded-md w-fit">
                          Est. Duration: {t.estimatedDurationMinutes} mins
                        </span>
                      )}
                      <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md px-2 py-0.5 w-fit">
                        <User className="h-3.5 w-3.5" />
                        By: {t.creator?.name}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAssign(t.id)}
                    disabled={actionLoading}
                    className="w-full mt-5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 font-bold shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Accept Job</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )
          ) : myTickets.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-16 text-center text-gray-400">
              <UserCheck className="h-12 w-12 text-gray-300 mb-3" />
              <p className="font-semibold">No active tickets</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
                Select any open breakdown from the Queue tab to start working.
              </p>
            </div>
          ) : (
            myTickets.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {t.machine?.name} ({t.machine?.brand})
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      IN PROGRESS
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 text-base leading-snug">
                    {t.issue}
                  </h3>

                  {t.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {t.description}
                    </p>
                  )}

                  <div className="h-px bg-gray-50 pt-2" />

                  <div className="flex flex-col gap-1.5 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-300" />
                      Reported:{' '}
                      {new Date(t.reportedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {t.assignedAt && (
                      <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                        Started:{' '}
                        {new Date(t.assignedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    {t.estimatedDurationMinutes && (
                      <span className="flex items-center gap-1.5 text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded-md w-fit">
                        Est. Duration: {t.estimatedDurationMinutes} mins
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md px-2 py-0.5 w-fit">
                      <User className="h-3.5 w-3.5" />
                      By: {t.creator?.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Button
                    onClick={() => handleRelease(t.id)}
                    disabled={actionLoading}
                    variant="secondary"
                    className="rounded-xl py-2 font-bold text-xs flex items-center justify-center gap-1.5 border border-gray-200"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Release
                  </Button>
                  <Button
                    onClick={() => setClosingTicketId(t.id)}
                    disabled={actionLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Close Ticket
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination (technician dashboard list) */}
      {activeTab === 'open' && totalOpenTickets > PAGINATION_LIMIT && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6 bg-white p-4 rounded-xl">
          <span className="text-xs font-semibold text-gray-500">
            Page {currentPage + 1} of{' '}
            {Math.ceil(totalOpenTickets / PAGINATION_LIMIT)}
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
                (currentPage + 1) * PAGINATION_LIMIT >= totalOpenTickets
              }
              className="rounded-lg text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'mine' && totalMyTickets > PAGINATION_LIMIT && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6 bg-white p-4 rounded-xl">
          <span className="text-xs font-semibold text-gray-500">
            Page {currentPage + 1} of{' '}
            {Math.ceil(totalMyTickets / PAGINATION_LIMIT)}
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
              disabled={(currentPage + 1) * PAGINATION_LIMIT >= totalMyTickets}
              className="rounded-lg text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Close Ticket Modal */}
      {closingTicketId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50 text-emerald-800">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Finish Repair & Close Ticket
              </h3>
              <button
                onClick={() => {
                  setClosingTicketId(null);
                  setResolutionReason('');
                  setActualDuration('');
                }}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCloseSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Resolution Summary * (Min 5 characters)
                </label>
                <textarea
                  value={resolutionReason}
                  onChange={(e) => setResolutionReason(e.target.value)}
                  rows={4}
                  placeholder="Explain the cause, parts replaced, and test results..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-medium text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Actual Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={actualDuration}
                  onChange={(e) => setActualDuration(e.target.value)}
                  placeholder="Actual minutes spent repairing"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-medium text-gray-800"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setClosingTicketId(null);
                    setResolutionReason('');
                    setActualDuration('');
                  }}
                  className="rounded-xl border border-gray-200 text-xs px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs px-5 font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Record Closure'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTechnicianDashboard;
