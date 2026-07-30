import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const surfaceClasses = {
  default: 'bg-surface',
  primary: 'border-primary/20 bg-primary text-white',
  cream: 'bg-cream',
};

export default function Card({
  children,
  className,
  hover = true,
  padding = true,
  surface = 'default',
  as: Component = motion.div,
  ...props
}) {
  return (
    <Component
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'rounded-3xl border border-line shadow-soft',
        surfaceClasses[surface] || surfaceClasses.default,
        hover && 'hover:shadow-card',
        padding && 'p-5 md:p-6',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
