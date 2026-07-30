import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-primary text-white shadow-glow hover:bg-primary-hover focus-visible:ring-primary',
  secondary:
    'bg-white text-ink border border-line hover:bg-cream focus-visible:ring-accent',
  ghost:
    'bg-transparent text-ink hover:bg-white/80 focus-visible:ring-line',
  soft: 'bg-primary-soft text-primary hover:bg-[#fad5db] focus-visible:ring-primary',
  accent:
    'bg-accent text-white hover:bg-[#c49335] focus-visible:ring-accent',
  success:
    'bg-success text-white hover:bg-[#4f7c67] focus-visible:ring-success',
  danger:
    'bg-[#FDE8EB] text-primary hover:bg-[#fad0d6] focus-visible:ring-primary',
};

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-11 px-5 text-sm rounded-2xl',
  lg: 'h-12 px-6 text-base rounded-2xl',
  icon: 'h-10 w-10 rounded-2xl p-0',
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </motion.button>
  );
}
