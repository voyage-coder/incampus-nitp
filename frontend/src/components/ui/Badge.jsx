import { cn } from '../../utils/cn';

export default function Badge({ children, tone = 'neutral', className, ...props }) {
  const tones = {
    neutral: 'bg-[#F3EDE4] text-muted',
    primary: 'bg-primary-soft text-primary',
    accent: 'bg-accent-soft text-[#9A7320]',
    success: 'bg-success-soft text-success',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
