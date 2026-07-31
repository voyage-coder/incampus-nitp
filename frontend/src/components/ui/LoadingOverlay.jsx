import { cn } from '../../utils/cn';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingOverlay({
  show = false,
  label = 'Please wait…',
  className,
  children,
}) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {show && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-surface/80 backdrop-blur-[2px]"
          aria-busy="true"
          aria-live="polite"
        >
          <LoadingSpinner size="lg" className="text-primary" />
          <p className="text-sm font-medium text-muted">{label}</p>
        </div>
      )}
    </div>
  );
}
