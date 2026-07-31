import { cn } from '../../utils/cn';

export default function LoadingSpinner({
  size = 'md',
  className,
  label = 'Loading',
}) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-8 w-8 border-[3px]',
  };

  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full border-current border-r-transparent',
        sizes[size],
        className
      )}
    />
  );
}
