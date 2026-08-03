import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchMachinistDashboard } from '@/features/shift/shiftThunk';
import {
  CheckCircle2,
  Clock,
  ClipboardList,
  Layers,
  RefreshCcw,
  CalendarDays,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  Hourglass,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { shiftStatusConfig } from '@/shared/constants/constant';
import { SkeletonCard } from '../components/SkelitonCard';
import { StatCard } from '../components/StatCard';
import { JobCard } from '../components/JobCard';

const shiftTypeConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  MORNING: {
    label: 'Morning',
    icon: <Sun size={15} />,
    color: 'text-amber-700',
    bg: 'bg-amber-100',
  },
  EVENING: {
    label: 'Evening',
    icon: <Sunset size={15} />,
    color: 'text-purple-700',
    bg: 'bg-purple-100',
  },
  NIGHT: {
    label: 'Night',
    icon: <Moon size={15} />,
    color: 'text-slate-700',
    bg: 'bg-slate-100',
  },
};

const MachinistDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { machinistDashboard: stats, machinistDashboardLoading: loading } =
    useAppSelector((state) => state.shift);

  const load = useCallback(() => {
    dispatch(fetchMachinistDashboard());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const shift = stats?.todayShift;
  const shiftTypeCfg = shift ? shiftTypeConfig[shift.shiftType] : null;
  const shiftStatusCfg = shift ? shiftStatusConfig[shift.status] : null;

  const overallPct =
    stats && stats.totalAssignedParts > 0
      ? Math.min(
          100,
          Math.round(
            (stats.totalCompletedParts / stats.totalAssignedParts) * 100,
          ),
        )
      : 0;

  const pendingJobs = stats?.jobs.filter((j) => j.status === 'PENDING') ?? [];
  const inProgressJobs =
    stats?.jobs.filter((j) => j.status === 'IN_PROGRESS') ?? [];
  const completedJobs =
    stats?.jobs.filter((j) => j.status === 'COMPLETED') ?? [];
  const activeJobs = [...inProgressJobs, ...pendingJobs];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good day,{' '}
            <span className="text-[#4f46e5]">{user?.name?.split(' ')[0]}</span>{' '}
            👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1.5">
            <CalendarDays size={13} />
            {dateLabel}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Today's Shift Banner ─────────────────────────────────────────── */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-20" />
      ) : shift ? (
        <div className="bg-gradient-to-r from-[#4f46e5] to-indigo-400 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ClipboardList size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Today's Shift
              </p>
              <p className="text-xl font-bold">{shiftTypeCfg?.label} Shift</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {shiftTypeCfg && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20">
                {shiftTypeCfg.icon}
                {shiftTypeCfg.label}
              </span>
            )}
            {shiftStatusCfg && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20">
                {shift.status === 'COMPLETED' ? (
                  <CheckCircle2 size={12} />
                ) : shift.status === 'IN_PROGRESS' ? (
                  <Loader2 size={12} />
                ) : (
                  <Hourglass size={12} />
                )}
                {shiftStatusCfg.label}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
          <AlertCircle size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="font-semibold text-gray-500">No shift assigned today</p>
          <p className="text-sm text-gray-400 mt-1">
            You don't have any production shift scheduled for today.
          </p>
        </div>
      )}

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={<Layers size={20} className="text-[#4f46e5]" />}
              label="Assigned Parts"
              value={stats?.totalAssignedParts ?? 0}
              accent="bg-[#4f46e5]/10"
              sub="Total for today's shift"
            />
            <StatCard
              icon={<CheckCircle2 size={20} className="text-green-600" />}
              label="Parts Completed"
              value={stats?.totalCompletedParts ?? 0}
              accent="bg-green-50"
              sub="Made so far"
            />
            <StatCard
              icon={<Clock size={20} className="text-amber-600" />}
              label="Parts Remaining"
              value={stats?.totalRemainingParts ?? 0}
              accent="bg-amber-50"
              sub="Still to produce"
            />
            <StatCard
              icon={<Hourglass size={20} className="text-rose-500" />}
              label="Pending Jobs"
              value={stats?.pendingJobsCount ?? 0}
              accent="bg-rose-50"
              sub="Jobs not yet started"
            />
          </>
        )}
      </div>

      {/* ── Overall Progress ─────────────────────────────────────────────── */}
      {!loading && stats && stats.totalAssignedParts > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#4f46e5]" />
              <span className="font-semibold text-gray-700 text-sm">
                Overall Progress
              </span>
            </div>
            <span className="text-sm font-bold text-[#4f46e5]">
              {overallPct}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4f46e5] to-indigo-400 transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{stats.totalCompletedParts} completed</span>
            <span>{stats.totalAssignedParts} total</span>
          </div>

          {/* Job status pills */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-full font-semibold">
              <Hourglass size={12} />
              {stats.pendingJobsCount} Pending
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full font-semibold">
              <Loader2 size={12} />
              {stats.inProgressJobsCount} In Progress
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full font-semibold">
              <CheckCircle2 size={12} />
              {stats.completedJobsCount} Completed
            </div>
          </div>
        </div>
      )}

      {/* ── Jobs ─────────────────────────────────────────────────────────── */}
      {!loading && stats && stats.jobs.length > 0 && (
        <div className="space-y-5">
          {/* Active / To-Do jobs */}
          {activeJobs.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#4f46e5]" />
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  To Do &amp; In Progress
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {activeJobs.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* Completed jobs */}
          {completedJobs.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Completed
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {completedJobs.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Empty state (shift present but no jobs) ───────────────────────── */}
      {!loading && stats && stats.jobs.length === 0 && shift && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <ClipboardList size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="font-semibold text-gray-400">No jobs assigned</p>
          <p className="text-sm text-gray-300 mt-1">
            Your shift has no jobs assigned yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MachinistDashboard;
