export function SkeletonCard({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} className="aspect-square" />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 mt-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} className="h-48" />
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-4 mt-4">
      <SkeletonCard className="h-48" />
      <SkeletonCard className="h-32" />
      <SkeletonCard className="h-24" />
    </div>
  );
}
