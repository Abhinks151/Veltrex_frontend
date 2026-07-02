import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchProductionShifts } from '../shiftThunk';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Button } from '@/shared/components/ui/button';
import {
  RefreshCcw,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  ListChecks,
} from 'lucide-react';
import { ShiftStatus, ShiftType } from '../types';
import ShiftJobProgressCard from '../components/ShiftJobProgressCard';
import { Roles } from '@/shared/constants/rolesEnum';

const statusColors: Record<ShiftStatus, string> = {
  [ShiftStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [ShiftStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
  [ShiftStatus.COMPLETED]: 'bg-green-100 text-green-700',
};

const shiftTypeColors: Record<ShiftType, string> = {
  [ShiftType.MORNING]: 'bg-amber-100 text-amber-700',
  [ShiftType.EVENING]: 'bg-purple-100 text-purple-700',
  [ShiftType.NIGHT]: 'bg-slate-100 text-slate-700',
};

const ProductionShiftDashboard = () => {
  const dispatch = useAppDispatch();
  const { productionShifts, totalProductionShifts, loading } = useAppSelector(
    (state) => state.shift,
  );
  const { user } = useAppSelector((state) => state.auth);

  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);
  const [currentPage, setCurrentPage] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [expandedShiftIds, setExpandedShiftIds] = useState<Set<string>>(
    new Set(),
  );

  const [prevProductionShifts, setPrevProductionShifts] =
    useState(productionShifts);

  if (productionShifts !== prevProductionShifts) {
    setPrevProductionShifts(productionShifts);
    setExpandedShiftIds(new Set());
  }

  const isAdmin = user?.role === Roles.ADMIN;
  const today = new Date().toISOString().split('T')[0];

  const loadData = useCallback(() => {
    dispatch(
      fetchProductionShifts({
        page: currentPage + 1,
        limit: pageSize,
        date: dateFilter || undefined,
      }),
    );
  }, [dispatch, currentPage, pageSize, dateFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleShift = (id: string) => {
    setExpandedShiftIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () =>
    setExpandedShiftIds(new Set(productionShifts.map((s) => s.id)));
  const collapseAll = () => setExpandedShiftIds(new Set());
  const allExpanded =
    productionShifts.length > 0 &&
    expandedShiftIds.size === productionShifts.length;

  const groupedShifts = productionShifts.reduce<
    Record<string, typeof productionShifts>
  >((acc, shift) => {
    const key = shift.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(shift);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isAdmin ? 'Production Shifts' : 'My Shifts'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin
              ? 'View and monitor all active production shifts'
              : 'View your assigned shifts and update job progress'}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 font-medium home-date-label">
              Date
            </label>
            <input
              type="date"
              value={dateFilter}
              min={!isAdmin ? today : undefined}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
            />
            {dateFilter && (
              <button
                onClick={() => {
                  setDateFilter('');
                  setCurrentPage(0);
                }}
                className="text-xs text-red-500 underline ml-1"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Show</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={1000}>All</option>
            </select>
          </div>
        </div>

        {productionShifts.length > 0 && (
          <button
            type="button"
            onClick={allExpanded ? collapseAll : expandAll}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#4f46e5] transition-colors"
          >
            {allExpanded ? (
              <ChevronsDownUp size={16} />
            ) : (
              <ChevronsUpDown size={16} />
            )}
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        )}
      </div>

      {/* Shifts List (grouped by date) */}
      <div className="space-y-8 relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
          </div>
        )}

        {Object.entries(groupedShifts).map(([date, shiftsForDate]) => (
          <div key={date} className="space-y-3">
            <div className="sticky top-0 z-[5] flex items-center gap-3 bg-gray-50/95 backdrop-blur-sm py-2">
              <span className="text-sm font-bold text-gray-800">
                {new Date(date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="text-xs text-gray-400">
                {shiftsForDate.length}{' '}
                {shiftsForDate.length === 1 ? 'shift' : 'shifts'}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-3">
              {shiftsForDate.map((shift) => {
                const isExpanded = expandedShiftIds.has(shift.id);
                const jobCount = shift.shiftJobs?.length || 0;

                return (
                  <div
                    key={shift.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleShift(shift.id)}
                      aria-expanded={isExpanded}
                      className="w-full flex flex-wrap items-center justify-between gap-4 p-5 text-left hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Machinist
                          </span>
                          <span className="font-semibold text-gray-900 text-sm">
                            {shift.employee?.name || '—'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {shift.employee?.email}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Shift
                          </span>
                          <span
                            className={`w-fit px-2 py-0.5 rounded-md text-xs font-semibold ${shiftTypeColors[shift.shiftType]}`}
                          >
                            {shift.shiftType}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Status
                          </span>
                          <span
                            className={`w-fit px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[shift.status]}`}
                          >
                            {shift.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                          <ListChecks size={14} />
                          {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-3">
                          Assigned Jobs
                        </h4>
                        {jobCount === 0 ? (
                          <p className="text-sm text-gray-400">
                            No jobs assigned to this shift
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shift.shiftJobs!.map((job) => (
                              <ShiftJobProgressCard
                                key={job.id}
                                job={job}
                                onUpdated={loadData}
                                shiftDate={shift.date}
                                isAdmin={isAdmin}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {productionShifts.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            No production shifts found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {productionShifts.length > 0 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm mt-4">
          <div className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min((currentPage + 1) * pageSize, totalProductionShifts)}
            </span>{' '}
            of <span className="font-medium">{totalProductionShifts}</span>{' '}
            results
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(
                    Math.ceil(totalProductionShifts / pageSize) - 1,
                    p + 1,
                  ),
                )
              }
              disabled={(currentPage + 1) * pageSize >= totalProductionShifts}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionShiftDashboard;
