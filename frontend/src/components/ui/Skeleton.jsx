import { cn } from '../../utils/cn';

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-[#F0E9DF]',
        className
      )}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-soft space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
