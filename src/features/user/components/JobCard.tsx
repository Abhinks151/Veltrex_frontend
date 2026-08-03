import type { MachinistDashboardJobItem } from '@/features/shift/types';
import { statusConfig } from '@/shared/constants/constant';

export function JobCard({ job }: { job: MachinistDashboardJobItem }) {
  const pct =
    job.assignedQuantity > 0
      ? Math.min(
          100,
          Math.round((job.completedQuantity / job.assignedQuantity) * 100),
        )
      : 0;

  const status = statusConfig[job.status] ?? statusConfig.PENDING;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {job.partName}
          </p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            #{job.partNumber}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${status.bg} ${status.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Quantities */}
      <div className="grid grid-cols-3 text-center gap-2">
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
            Assigned
          </p>
          <p className="text-lg font-bold text-gray-800">
            {job.assignedQuantity}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg py-2">
          <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">
            Done
          </p>
          <p className="text-lg font-bold text-green-700">
            {job.completedQuantity}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg py-2">
          <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">
            Left
          </p>
          <p className="text-lg font-bold text-amber-700">
            {job.assignedQuantity - job.completedQuantity}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-gray-600">{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4f46e5] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
