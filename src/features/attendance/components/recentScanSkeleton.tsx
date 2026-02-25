export default function RecentScanSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-100"
        >
          <div className="h-10 w-10 rounded-lg bg-slate-300" />

          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-300 rounded w-3/4" />
            <div className="h-2 bg-slate-200 rounded w-1/2" />
          </div>

          <div className="space-y-2">
            <div className="h-2 w-10 bg-slate-300 rounded" />
            <div className="h-2 w-12 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}