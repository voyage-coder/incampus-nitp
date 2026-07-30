import { cn } from '../../utils/cn';

export default function Textarea({
  label,
  error,
  className,
  containerClassName,
  id,
  rows = 4,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <label className={cn('block space-y-1.5', containerClassName)}>
      {label && (
        <span className="text-sm font-medium text-ink">{label}</span>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={cn(
          'w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20',
          error && 'border-primary',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-primary">{error}</span>}
    </label>
  );
}
