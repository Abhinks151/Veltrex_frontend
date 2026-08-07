import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getTenant } from '@/features/tenant/tenantThunk';
import { jobService } from '@/services/jobService';
import { maintenanceService } from '@/services/maintenanceService';
import { machineService } from '@/services/machineService';
import type { Job } from '@/features/job/types';
import { JobStatus } from '@/features/job/types';
import type { MaintenanceTicket } from '@/features/maintenance/types';
import { MachineStatus } from '@/shared/types/machine-status.enum';
import {
  Briefcase,
  CheckCircle2,
  Wrench,
  ArrowRight,
  RefreshCw,
  Clock,
  ChevronRight,
  Package,
  AlertTriangle,
  Activity,
} from 'lucide-react';

interface DashboardData {
  activeJobsCount: number;
  completedJobsCount: number;
  maintenanceMachinesCount: number;
  recentJobs: Job[];
  recentTickets: MaintenanceTicket[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  OPEN: 'bg-orange-50 text-orange-700 border-orange-200',
  CLOSED: 'bg-slate-50 text-slate-600 border-slate-200',
};

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-500',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
  URGENT: 'bg-purple-100 text-purple-700',
};

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 p-6 rounded-2xl animate-pulse space-y-3">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="w-28 h-3 bg-gray-200 rounded" />
        <div className="w-16 h-8 bg-gray-200 rounded" />
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
    </div>
    <div className="w-24 h-3 bg-gray-200 rounded" />
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
    <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="w-40 h-3 bg-gray-200 rounded" />
      <div className="w-24 h-2.5 bg-gray-200 rounded" />
    </div>
    <div className="w-16 h-5 bg-gray-200 rounded-full" />
  </div>
);

const AdminDashBoard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { name: tenantName } = useAppSelector((state) => state.tenant);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    dispatch(getTenant());
  }, [dispatch]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, machinesRes, ticketsRes] = await Promise.all([
        jobService.list({ page: 1, limit: 500 }),
        machineService.list({ page: 1, limit: 500 }),
        maintenanceService.getAdminLogs({ page: 1, limit: 5 }),
      ]);

      const allJobs: Job[] = jobsRes.data?.data?.items ?? [];
      const allMachines = machinesRes.data?.data?.machines ?? [];
      const allTickets: MaintenanceTicket[] =
        ticketsRes.data?.data?.items ?? [];

      const activeJobsCount = allJobs.filter(
        (j) =>
          j.status === JobStatus.IN_PROGRESS || j.status === JobStatus.PENDING,
      ).length;

      const completedJobsCount = allJobs.filter(
        (j) => j.status === JobStatus.COMPLETED,
      ).length;

      const maintenanceMachinesCount = allMachines.filter(
        (m) => m.status === MachineStatus.MAINTENANCE,
      ).length;

      // Last 5 updated jobs
      const recentJobs = [...allJobs]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5);

      setData({
        activeJobsCount,
        completedJobsCount,
        maintenanceMachinesCount,
        recentJobs,
        recentTickets: allTickets,
      });
      setLastRefreshed(new Date());
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatRelative = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const statCards = [
    {
      label: 'Active Jobs',
      value: data?.activeJobsCount ?? 0,
      icon: Briefcase,
      gradient: 'from-violet-500 to-indigo-600',
      bg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      sub: 'Pending & In Progress',
    },
    {
      label: 'Completed Jobs',
      value: data?.completedJobsCount ?? 0,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      sub: 'Successfully finished',
    },
    {
      label: 'Machines in Maintenance',
      value: data?.maintenanceMachinesCount ?? 0,
      icon: Wrench,
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      sub: 'Currently under service',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-gray-100 pb-5 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e1b4b] tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            Welcome back,{' '}
            <span className="text-[#4f46e5] font-semibold">{user?.name}</span>
            {tenantName && (
              <span className="text-gray-400"> · {tenantName}</span>
            )}
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl shadow-xs hover:border-[#4f46e5] hover:text-[#4f46e5] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
          {!loading && (
            <span className="text-gray-400 font-normal">
              · {formatTime(lastRefreshed)}
            </span>
          )}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading && !data
          ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="relative overflow-hidden bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  {/* Decorative background gradient orb */}
                  <div
                    className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-8 blur-2xl group-hover:opacity-15 transition-opacity duration-500`}
                  />

                  <div className="flex justify-between items-start relative">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        {card.label}
                      </p>
                      <h3 className="text-4xl font-extrabold text-[#1e1b4b] mt-2 tracking-tight tabular-nums">
                        {loading && !data ? '—' : card.value}
                      </h3>
                    </div>
                    <div
                      className={`p-3 ${card.bg} rounded-xl group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">
                      {card.sub}
                    </span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Bottom two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Last 5 Updated Jobs */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#1e1b4b]">
                Recent Job Activity
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Last 5 updated jobs
              </p>
            </div>
            <button
              onClick={() => navigate('/platform/jobs')}
              className="flex items-center gap-1 text-xs text-[#4f46e5] font-semibold hover:text-[#4338ca] transition-colors cursor-pointer group"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-gray-50 px-3 py-2">
            {loading && !data ? (
              [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
            ) : !data || data.recentJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Briefcase className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-semibold">No jobs found</p>
              </div>
            ) : (
              data.recentJobs.map((job) => {
                const partName = job.part?.name ?? 'Unknown Part';
                const partNumber = job.part?.partNumber ?? '—';
                // Try to get completed quantity from job quantity if status completed
                const qtyLabel =
                  job.status === JobStatus.COMPLETED
                    ? `${job.quantity} / ${job.quantity} completed`
                    : `0 / ${job.quantity} completed`;

                return (
                  <div
                    key={job.id}
                    onClick={() => navigate('/platform/jobs')}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/70 transition-all duration-150 cursor-pointer group"
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 bg-indigo-50 text-[#4f46e5] border border-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <Package className="w-4 h-4" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#4f46e5] transition-colors leading-tight">
                        {partName}
                        <span className="text-gray-400 font-medium ml-1.5">
                          #{partNumber}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                        {qtyLabel} ·{' '}
                        <span className="text-gray-500">
                          {formatRelative(job.updatedAt)}
                        </span>
                      </p>
                    </div>

                    {/* Status + Priority badges */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusColors[job.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {job.status.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${priorityColors[job.priority] ?? 'bg-gray-100 text-gray-500'}`}
                      >
                        {job.priority}
                      </span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#4f46e5] transition-colors ml-1 flex-shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Last 5 Maintenance Tickets */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#1e1b4b]">
                Maintenance Tickets
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 5 tickets</p>
            </div>
            <button
              onClick={() => navigate('/maintenance/logs')}
              className="flex items-center gap-1 text-xs text-[#4f46e5] font-semibold hover:text-[#4338ca] transition-colors cursor-pointer group"
            >
              View Logs
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-gray-50 px-3 py-2">
            {loading && !data ? (
              [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
            ) : !data || data.recentTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Wrench className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-semibold">No maintenance tickets</p>
              </div>
            ) : (
              data.recentTickets.map((ticket) => {
                const machineName = ticket.machine?.name ?? 'Unknown Machine';
                const machineBrand = ticket.machine?.brand ?? '';

                return (
                  <div
                    key={ticket.id}
                    onClick={() => navigate('/platform/maintenance/logs')}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/70 transition-all duration-150 cursor-pointer group"
                  >
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        ticket.status === 'OPEN'
                          ? 'bg-orange-50 border border-orange-100 text-orange-500 group-hover:bg-orange-100'
                          : ticket.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 border border-blue-100 text-blue-500 group-hover:bg-blue-100'
                            : 'bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-slate-100'
                      }`}
                    >
                      {ticket.status === 'CLOSED' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : ticket.status === 'IN_PROGRESS' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#4f46e5] transition-colors leading-tight">
                        {machineName}
                        {machineBrand && (
                          <span className="text-gray-400 font-medium ml-1">
                            · {machineBrand}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate font-medium">
                        {ticket.issue}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {formatRelative(ticket.updatedAt)}
                        {ticket.assignee && (
                          <span className="text-[#4f46e5]/80 ml-1.5">
                            · {ticket.assignee.name}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusColors[ticket.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#4f46e5] transition-colors ml-1 flex-shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick nav footer */}
      <div className="bg-gradient-to-r from-[#4f46e5]/5 to-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Navigation
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Jobs', path: '/platform/jobs' },
            { label: 'Daily Shifts', path: '/platform/shifts' },
            { label: 'Maintenance Logs', path: '/platform/maintenance/logs' },
            { label: 'Machines', path: '/platform/machines' },
            { label: 'Employees', path: '/platform/employees' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-indigo-100 text-[#4f46e5] text-xs font-semibold rounded-xl shadow-xs hover:bg-[#4f46e5] hover:text-white hover:border-[#4f46e5] transition-all cursor-pointer group"
            >
              {item.label}
              <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
