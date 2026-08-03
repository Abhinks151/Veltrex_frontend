export function StatCard({
  icon,
  label,
  value,
  accent,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`p-3 rounded-xl ${accent} shrink-0`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
