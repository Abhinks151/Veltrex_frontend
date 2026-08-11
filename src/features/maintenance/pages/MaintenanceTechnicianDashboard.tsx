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
import { ClipboardList, UserCheck, FileCheck, RefreshCw } from 'lucide-react';
import { OpenTicketItem } from '../components/OpenTicketItem';
import { ActiveTicketItem } from '../components/ActiveTicketItem';
import { CloseTicketModal } from '../components/CloseTicketModal';

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

  const [closingTicketId, setClosingTicketId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (activeTab === 'open') {
      await dispatch(
        fetchOpenTickets({ page: currentPage + 1, limit: PAGINATION_LIMIT }),
      );
    } else {
      await dispatch(
        fetchMyTickets({ page: currentPage + 1, limit: PAGINATION_LIMIT }),
      );
    }
    setIsRefreshing(false);
  };

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

  const handleCloseSubmit = async (
    ticketId: string,
    reason: string,
    duration?: number,
  ) => {
    const payload = {
      reason,
      actualDurationMinutes: duration,
    };

    const res = await dispatch(
      closeTicket({
        id: ticketId,
        data: payload,
      }),
    );

    if (closeTicket.fulfilled.match(res)) {
      notifySuccess('Ticket closed and machine marked as Idle successfully!');
      setClosingTicketId(null);
      loadData();
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-white shadow-md">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Maintenance Operations
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Claim new machine breakdown requests, manage your active tasks,
              and record repair details.
            </p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={loading || isRefreshing}
          className="flex items-center gap-2 rounded-xl border-gray-200"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
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
                <OpenTicketItem
                  key={t.id}
                  ticket={t}
                  actionLoading={actionLoading}
                  onAssign={handleAssign}
                />
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
              <ActiveTicketItem
                key={t.id}
                ticket={t}
                actionLoading={actionLoading}
                onRelease={handleRelease}
                onClose={(id) => setClosingTicketId(id)}
              />
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
      <CloseTicketModal
        ticketId={closingTicketId}
        onClose={() => setClosingTicketId(null)}
        onSubmit={handleCloseSubmit}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default MaintenanceTechnicianDashboard;
