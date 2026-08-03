export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 bg-gray-100 rounded w-20" />
          <div className="h-8 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
