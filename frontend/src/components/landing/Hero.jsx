import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  ShoppingBag,
} from 'lucide-react';
import Button from '../ui/Button';

const floating = [
  {
    title: 'Fest registrations open',
    meta: 'Events',
    icon: CalendarDays,
    className: 'left-[-6%] top-[18%] hidden xl:flex',
    delay: 0.2,
  },
  {
    title: 'MacBook Air · ₹42,000',
    meta: 'Marketplace',
    icon: ShoppingBag,
    className: 'right-[-4%] top-[28%] hidden lg:flex',
    delay: 0.35,
  },
  {
    title: 'DSA PYQs · SEM4',
    meta: 'Academics',
    icon: BookOpen,
    className: 'bottom-[12%] left-[-2%] hidden md:flex',
    delay: 0.45,
  },
  {
    title: 'Amazon SDE intern',
    meta: 'Placements',
    icon: Briefcase,
    className: 'bottom-[8%] right-[-2%] hidden lg:flex',
    delay: 0.55,
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
      <div className="pointer-events-none absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-soft" />
      <div className="pointer-events-none absolute right-[12%] top-40 h-40 w-40 rounded-full bg-accent-soft" />

      <div className="relative mx-auto grid max-w-wide items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9A7320]"
          >
            Built for NIT Patna
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            InCampus
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-4 max-w-xl text-lg text-muted sm:text-xl"
          >
            The campus operating system for students — marketplace, events,
            clubs, placements, PYQs, and resumes in one calm workspace.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/register">
              <Button size="lg">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="secondary">
                See how it works
              </Button>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          className="relative"
        >
          {floating.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
              className={`absolute z-20 items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2.5 shadow-card ${item.className}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-muted">{item.meta}</p>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
              </div>
            </motion.div>
          ))}

          <div className="relative overflow-hidden rounded-4xl border border-line bg-white p-4 shadow-lift sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  Student workspace
                </p>
                <p className="font-display text-xl font-bold text-ink">
                  Good afternoon, Aanya
                </p>
              </div>
              <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                Live preview
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Upcoming fest', value: ' technika · 3d', tone: 'bg-primary-soft text-primary' },
                { label: 'Resume score', value: '72%', tone: 'bg-accent-soft text-[#9A7320]' },
                { label: 'Saved listings', value: '5 items', tone: 'bg-success-soft text-success' },
                { label: 'New PYQs', value: '12 this week', tone: 'bg-[#F3EDE4] text-muted' },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl border border-line bg-cream p-4"
                >
                  <p className="text-xs text-muted">{card.label}</p>
                  <p className="mt-2 font-display text-lg font-bold text-ink">
                    {card.value}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${card.tone}`}
                  >
                    Open
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-3xl border border-line bg-cream p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Placement update
                  </p>
                  <p className="text-xs text-muted">
                    2 new interview experiences this week
                  </p>
                </div>
                <Button size="sm" variant="soft">
                  View
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
