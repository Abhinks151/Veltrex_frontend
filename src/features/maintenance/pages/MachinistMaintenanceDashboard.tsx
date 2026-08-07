import { useCallback, useEffect, useState } from 'react';
import { Wrench, Activity } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { clearMaintenanceError } from '../maintenanceSlice';
import {
  createMaintenanceTicket,
  deleteTicket,
  fetchMachinistMachines,
  fetchMachinistTickets,
} from '../maintenanceThunk';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';

import ReportForm from '../components/ReportForm';
import TicketList from '../components/TicketList';
import PaginationControls from '../components/PaginationControls';

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

  // ---------------- Form State ----------------
  const [machineId, setMachineId] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  // ---------------- Pagination ----------------
  const [currentPage, setCurrentPage] = useState(0);

  const loadTickets = useCallback(() => {
    dispatch(
      fetchMachinistTickets({
        page: currentPage + 1,
        limit: PAGINATION_LIMIT,
      }),
    );
  }, [dispatch, currentPage]);

  const loadMachines = useCallback(() => {
    dispatch(fetchMachinistMachines());
  }, [dispatch]);

  useEffect(() => {
    loadMachines();
    loadTickets();
  }, [loadMachines, loadTickets]);

  useEffect(() => {
    if (error) {
      notifyError(error);
      dispatch(clearMaintenanceError());
    }
  }, [error, dispatch]);

  // ---------------- Submit ----------------

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

    const result = await dispatch(
      createMaintenanceTicket({
        machineId,
        issue: issue.trim(),
        description: description.trim() || undefined,
        estimatedDurationMinutes: estimatedDuration
          ? Number(estimatedDuration)
          : undefined,
      }),
    );

    if (createMaintenanceTicket.fulfilled.match(result)) {
      notifySuccess('Maintenance ticket reported successfully');

      setMachineId('');
      setIssue('');
      setDescription('');
      setEstimatedDuration('');

      loadTickets();
    }
  };

  // ---------------- Delete ----------------

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteTicket(id));

    if (deleteTicket.fulfilled.match(result)) {
      notifySuccess('Ticket deleted');
      loadTickets();
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}

      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
          <Wrench className="h-6 w-6 animate-pulse" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold">Maintenance Dashboard</h1>

          <p className="text-gray-500 text-sm mt-1">
            Report machine issues from your assigned shifts and track their
            resolution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}

        <ReportForm
          machines={machinistMachines}
          machineId={machineId}
          issue={issue}
          description={description}
          estimatedDuration={estimatedDuration}
          actionLoading={actionLoading}
          onMachineChange={setMachineId}
          onIssueChange={setIssue}
          onDescriptionChange={setDescription}
          onEstimatedDurationChange={setEstimatedDuration}
          onSubmit={handleSubmit}
        />

        {/* Right */}

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Activity className="h-5 w-5 text-indigo-500" />
              Your Reported Tickets
            </h2>

            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
              {totalMachinistTickets} Reported
            </span>
          </div>

          <TicketList tickets={machinistTickets} onDelete={handleDelete} />

          <PaginationControls
            currentPage={currentPage}
            total={totalMachinistTickets}
            onPrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
            onNext={() => setCurrentPage((p) => p + 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default MachinistMaintenanceDashboard;
