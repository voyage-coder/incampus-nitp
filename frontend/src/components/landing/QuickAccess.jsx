import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  ShoppingBag,
  Users,
} from 'lucide-react';

const links = [
  { to: '/register', label: 'Marketplace', icon: ShoppingBag },
  { to: '/register', label: 'Events', icon: CalendarDays },
  { to: '/register', label: 'Clubs', icon: Users },
  { to: '/register', label: 'Placements', icon: Briefcase },
  { to: '/register', label: 'PYQs', icon: BookOpen },
  { to: '/register', label: 'Resume', icon: FileText },
];

export default function QuickAccess() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-wide">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Quick access
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              Jump into campus tools
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {links.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={item.to}
                className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-white px-4 py-5 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-ink">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
