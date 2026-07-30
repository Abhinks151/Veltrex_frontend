import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '@/services/superAdminService';
import { notifyError } from '@/shared/utils/toasterUtils';
import type { RevenueDashboardStats } from '../types';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import {
  Building,
  Coins,
  TrendingDown,
  TrendingUp,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  CreditCard,
} from 'lucide-react';
import RevenueGrowthChart from '../components/RevenueGrowthChart';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const RevenueDashboard = () => {
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

  const [stats, setStats] = useState<RevenueDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRevenueStats = useCallback(async () => {
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
      const res = await superAdminService.getRevenueStats(params);
      if (res.data?.success) {
        setStats(res.data.data);
      } else {
        notifyError(
          res.data?.message ||
            FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_FETCH_REVENUE,
        );
      }
    } catch {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  }, [range, startDate, endDate]);

  useEffect(() => {
    fetchRevenueStats();
  }, [fetchRevenueStats]);

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
    fetchRevenueStats();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const growth = stats?.revenueGrowthPercentage ?? 0;
  const isPositiveGrowth = growth >= 0;

  // Exports
  const downloadPDFHandler = () => {
    if (!stats || !stats.payments || stats.payments.length === 0) {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.REVENUE_NO_EXPORT_DATA);
      return;
    }
    const doc = new jsPDF();

    // Add Veltrex Branding/Headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 27, 75); // Theme Indigo color
    doc.text('VELTREX ADMIN CONSOLE - REVENUE MANAGEMENT', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Financial Performance Report (${range.toUpperCase()})`, 14, 25);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Key Stats Section
    doc.setFillColor(248, 249, 252);
    doc.rect(14, 35, 182, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 27, 75);
    doc.text(
      `Total Period Revenue: ${formatCurrency(stats.periodRevenue)}`,
      18,
      43,
    );
    doc.text(`Active Subscriptions: ${stats.activeSubscriptionsCount}`, 18, 49);
    doc.text(
      `Avg Revenue Per Account: ${formatCurrency(stats.averageRevenuePerAccount)}`,
      110,
      46,
    );

    const tableColumn = [
      'Owner Organization',
      'Subscribed Plan',
      'Amount',
      'Provider',
      'Order ID',
      'Date & Time',
    ];
    const tableRows = stats.payments.map((p) => [
      p.tenant?.name || 'N/A',
      p.plan?.name || 'Free/Custom',
      `${p.currency} ${parseFloat(p.amount).toLocaleString('en-IN')}`,
      p.provider,
      p.providerOrderId || p.id.split('-')[0],
      new Date(p.createdAt).toLocaleDateString() +
        ' ' +
        new Date(p.createdAt).toLocaleTimeString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      alternateRowStyles: { fillColor: [248, 249, 252] },
      styles: { fontSize: 8 },
    });

    doc.save(
      `Veltrex_Revenue_Report_${range}_${new Date().toISOString().split('T')[0]}.pdf`,
    );
  };

  const downloadExcelHandler = () => {
    if (!stats || !stats.payments || stats.payments.length === 0) {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.REVENUE_NO_EXPORT_DATA);
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      stats.payments.map((p) => ({
        'Transaction ID': p.id,
        'Order ID': p.providerOrderId || '',
        'Payment ID': p.providerPaymentId || '',
        'Tenant/Organization': p.tenant?.name || 'N/A',
        'Subscribed Plan': p.plan?.name || 'Free/Custom',
        Amount: Number(p.amount),
        Currency: p.currency,
        Provider: p.provider,
        'Transaction Date': new Date(p.createdAt).toLocaleString(),
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments History');
    XLSX.writeFile(
      workbook,
      `Veltrex_Revenue_Report_${range}_${new Date().toISOString().split('T')[0]}.xlsx`,
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Upper Header */}
      <div className="border-b border-gray-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e1b4b] tracking-tight">
            Revenue Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            Monitor and analyze platform financial performance
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={downloadPDFHandler}
            disabled={loading || !stats?.payments.length}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-250 text-gray-700 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold select-none shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4 text-red-500" />
            Download PDF
          </button>
          <button
            onClick={downloadExcelHandler}
            disabled={loading || !stats?.payments.length}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-250 text-gray-700 bg-white hover:bg-gray-50 rounded-xl text-xs font-semibold select-none shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Date Filters Panel */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 pl-1">
              <Calendar className="w-4 h-4 text-[#4f46e5]" /> Date Range:
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

          {/* Date picking drawer for Custom range */}
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
                Apply Range
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
          {/* Card 1: Period Revenue */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Period Revenue
                </p>
                <h3 className="text-3xl font-extrabold text-[#1e1b4b] mt-2 tracking-tight group-hover:scale-101 transition-transform origin-left">
                  {formatCurrency(stats?.periodRevenue ?? 0)}
                </h3>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl group-hover:bg-indigo-50 text-[#4f46e5] transition-colors">
                <Coins className="w-5 h-5" />
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
                  {growth}% growth
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                vs previous period
              </span>
            </div>
          </div>

          {/* Card 2: Average Revenue Per Account */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Avg Rev Per Account
                </p>
                <h3 className="text-3xl font-extrabold text-[#1e1b4b] mt-2 tracking-tight group-hover:scale-101 transition-transform origin-left">
                  {formatCurrency(stats?.averageRevenuePerAccount ?? 0)}
                </h3>
              </div>
              <div className="p-3 bg-violet-50/50 rounded-xl group-hover:bg-violet-50 text-violet-600 transition-colors">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-violet-600 font-medium">
                <span>Lifetime total / onboarded organizations</span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Subscription Accounts */}
          <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Active Subscriptions
                </p>
                <h3 className="text-3xl font-extrabold text-[#1e1b4b] mt-2 tracking-tight group-hover:scale-101 transition-transform origin-left">
                  {stats?.activeSubscriptionsCount ?? 0}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl group-hover:bg-emerald-50 text-emerald-600 transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <span>Total active paying and trial tenants</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Section: Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart Panel */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#1e1b4b]">
                Platform Revenue Growth
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Financial performance and transactional value over the interval
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#10b981] rounded-full inline-block"></span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Revenue Value (INR)
              </span>
            </div>
          </div>

          <RevenueGrowthChart
            loading={loading}
            chartData={stats?.chartData ?? []}
          />
        </div>

        {/* Recent Subscriptions (Last 5) Section */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#1e1b4b]">
              Recent Subscriptions
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest subscription plan purchases
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
            ) : !stats || stats.recentSubscriptions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <CreditCard className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-semibold">
                  No subscription records found.
                </p>
              </div>
            ) : (
              stats.recentSubscriptions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 bg-gray-50/30 hover:bg-gray-50/80 border border-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold flex items-center justify-center rounded-lg uppercase text-sm select-none shadow-xs group-hover:scale-105 transition-transform">
                      {s.tenant?.name
                        ? s.tenant.name
                            .split(' ')
                            .slice(0, 2)
                            .map((w: string) => w[0])
                            .join('')
                        : 'S'}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 group-hover:text-[#4f46e5] transition-colors leading-tight">
                        {s.tenant?.name || 'Unknown Corp'}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {s.plan?.name} Plan
                      </span>
                      <span className="text-[9px] text-emerald-600/80 font-bold italic mt-0.5">
                        {s.tenant?.owner?.email}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}
                    >
                      {s.status}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">
                      {new Date(s.createdAt).toLocaleDateString(undefined, {
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
              <span>Manage Subscribed Tenants</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
