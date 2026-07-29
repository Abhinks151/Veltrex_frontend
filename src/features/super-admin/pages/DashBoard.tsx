import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '@/services/superAdminService';
import { notifyError } from '@/shared/utils/toasterUtils';
import type { DashboardStats } from '../types';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import {
  Building,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import GrowthDynamicsChart from '../components/GrowthChart';

const DashBoard = () => {
  const [range, setRange] = useState<'week' | 'month' | 'lifetime' | 'custom'>(
    'month',
  );

  const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const defaultEndDate = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardStats = useCallback(async () => {
    if (range === 'custom') {
      if (!startDate || !endDate) {
        setValidationError(
          FRONTEND_MESSAGE_CONSTANTS.ERROR.VALIDATION_DATE_REQUIRED,
        );
        notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.VALIDATION_DATE_REQUIRED);
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setValidationError(
          FRONTEND_MESSAGE_CONSTANTS.ERROR.VALIDATION_DATE_END_BEFORE_START,
        );
        notifyError(
          FRONTEND_MESSAGE_CONSTANTS.ERROR.VALIDATION_DATE_END_BEFORE_START,
        );
        return;
      }
    }

    setValidationError(null);
    setLoading(true);
    try {
      const params =
        range === 'custom' ? { range, startDate, endDate } : { range };

      const res = await superAdminService.getDashboardStats(params);
      if (res.data?.success) {
        setStats(res.data.data);
      } else {
        notifyError(
          res.data?.message ||
            FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_FETCH_DASHBOARD,
        );
      }
    } catch {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  }, [range, startDate, endDate]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleRangeChange = (
    newRange: 'week' | 'month' | 'lifetime' | 'custom',
  ) => {
    setRange(newRange);
    if (newRange === 'custom') {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  };

  const handleCustomDateApply = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDashboardStats();
  };

  // Safe percentage display
  const growth = stats?.tenantGrowthPercentage ?? 0;
  const isPositiveGrowth = growth >= 0;

  // Format currency helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Upper header */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-extrabold text-[#1e1b4b] tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">
          Operational metrics for Veltrex global ecosystem
        </p>
      </div>

      {/* Filters Panel — sits above the stat cards so the numbers below always
          reflect whichever range is currently selected */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 pl-1">
              <Calendar className="w-4 h-4 text-[#4f46e5]" /> Range:
            </span>
            <div className="bg-gray-150/80 p-0.5 rounded-xl border border-gray-200/80 inline-flex shadow-sm">
              {(['week', 'month', 'lifetime', 'custom'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRangeChange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    range === r
                      ? 'bg-white text-[#4f46e5] shadow-xs'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
                  }`}
                >
                  {r === 'week'
                    ? 'Last Week'
                    : r === 'month'
                      ? 'Last Month'
                      : r === 'lifetime'
                        ? 'Lifetime'
                        : 'Custom'}
                </button>
              ))}
            </div>
          </div>

          {/* Date picking drawer for Custom range, inline within the same panel */}
          {range === 'custom' && (
            <form
              onSubmit={handleCustomDateApply}
              className="flex flex-wrap items-center gap-3 flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4"
            >
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">
                  Start:
                </label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">
                  End:
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Apply Filter
              </button>

              {validationError && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 p-6 rounded-2xl animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="w-32 h-8 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Revenue */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Total Revenue
                </p>
                <h3 className="text-3xl font-extrabold text-[#1e1b4b] mt-2 tracking-tight group-hover:scale-101 transition-transform origin-left">
                  {formatCurrency(stats?.totalRevenue ?? 0)}
                </h3>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl group-hover:bg-indigo-50 text-[#4f46e5] transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Aggregated earnings</span>
              </div>
            </div>
          </div>

          {/* Card 2: Tenants (Growth Highlighted) */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Total Tenants
                </p>
                <h3 className="text-3xl font-extrabold text-[#1e1b4b] mt-2 tracking-tight group-hover:scale-101 transition-transform origin-left">
                  {stats?.totalTenants ?? 0}
                </h3>
              </div>
              <div className="p-3 bg-[#10b981]/10 rounded-xl group-hover:bg-[#10b981]/15 text-[#10b981] transition-colors">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isPositiveGrowth
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {isPositiveGrowth ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span>
                  {isPositiveGrowth ? '+' : ''}
                  {growth}% active growth
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                vs previous period
              </span>
            </div>
          </div>

          {/* Card 3: Active Users */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Active Users
                </p>
                <h3 className="text-3xl font-extrabold text-[#1e1b4b] mt-2 tracking-tight group-hover:scale-101 transition-transform origin-left">
                  {stats?.totalUsers ?? 0}+
                </h3>
              </div>
              <div className="p-3 bg-violet-50/50 rounded-xl group-hover:bg-violet-50 text-violet-600 transition-colors">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-violet-600 font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>Total ecosystem workspace accounts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Section: Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Dynamics Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#1e1b4b]">
                System Growth Dynamics
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Onboarded tenants over the specified range interval
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#4f46e5] rounded-full inline-block"></span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Tenants Registered
              </span>
            </div>
          </div>

          <GrowthDynamicsChart
            loading={loading}
            chartData={stats?.chartData ?? []}
          />
        </div>

        {/* Recent Tenants Section */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#1e1b4b]">Recent Tenants</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest system registrations
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[290px] pr-1">
            {loading && !stats ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-xl animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-2 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : !stats || stats.recentTenants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <Building className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-semibold">
                  No tenants registered yet.
                </p>
              </div>
            ) : (
              stats.recentTenants.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 bg-gray-50/30 hover:bg-gray-50/80 border border-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    {/* Organization initials logo representation */}
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-[#4f46e5] font-extrabold flex items-center justify-center rounded-lg uppercase text-sm select-none shadow-xs group-hover:scale-105 transition-transform">
                      {t.name
                        ? t.name
                            .split(' ')
                            .slice(0, 2)
                            .map((w: string) => w[0])
                            .join('')
                        : 'T'}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 group-hover:text-[#4f46e5] transition-colors leading-tight">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {t.subdomain}.lvh.me
                      </span>
                      <span className="text-[9px] text-[#4f46e5]/80 font-semibold italic mt-0.5">
                        owner: {t.ownerEmail}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    {/* Plan Code Tag badge wrapper */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        t.planStatus.toLowerCase() === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-gray-250 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {t.planStatus}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      {new Date(t.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <a
              href="/super-admin/tenants"
              className="inline-flex items-center gap-1.5 text-xs text-[#4f46e5] hover:text-[#4338ca] font-extrabold transition-colors cursor-pointer group"
            >
              <span>View All Organizations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
