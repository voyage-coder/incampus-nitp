import { cn } from '../../utils/cn';

export default function Input({
  label,
  error,
  className,
  containerClassName,
  id,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <label className={cn('block space-y-1.5', containerClassName)}>
      {label && (
        <span className="text-sm font-medium text-ink">{label}</span>
      )}
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20',
          error && 'border-primary focus:ring-primary/30',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-primary">{error}</span>}
    </label>
  );
}
