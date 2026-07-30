import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-line bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
