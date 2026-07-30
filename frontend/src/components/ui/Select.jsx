import { cn } from '../../utils/cn';

export default function Select({
  label,
  error,
  className,
  containerClassName,
  options = [],
  placeholder,
  id,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <label className={cn('block space-y-1.5', containerClassName)}>
      {label && (
        <span className="text-sm font-medium text-ink">{label}</span>
      )}
      <select
        id={inputId}
        className={cn(
          'h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20',
          error && 'border-primary',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const labelText = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error && <span className="text-xs text-primary">{error}</span>}
    </label>
  );
}
