import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { resolveUploadUrl } from '../../utils/media';
import { initials } from '../../utils/format';

export default function Avatar({
  name = '',
  src,
  size = 'md',
  className,
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
  };

  const imageUrl = !imageError ? resolveUploadUrl(src) : null;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setImageError(true)}
        className={cn(
          'rounded-2xl object-cover border border-line',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-2xl bg-primary-soft font-bold text-primary',
        sizes[size],
        className
      )}
      aria-hidden={!name}
    >
      {initials(name) || 'IC'}
    </div>
  );
}
