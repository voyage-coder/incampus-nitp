import { motion } from 'framer-motion';
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  Search,
  ShoppingBag,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Campus Marketplace',
    copy: 'Buy and sell books, gadgets, and essentials with trusted peers.',
  },
  {
    icon: CalendarDays,
    title: 'Events that matter',
    copy: 'Discover fests, workshops, and deadlines without the WhatsApp chaos.',
  },
  {
    icon: Users,
    title: 'Clubs & culture',
    copy: 'Explore societies, open recruitments, and join the right circle.',
  },
  {
    icon: Briefcase,
    title: 'Placement stories',
    copy: 'Real interview experiences, CTCs, and prep notes from seniors.',
  },
  {
    icon: FileText,
    title: 'Resume builder',
    copy: 'A multi-step builder with live preview and PDF export.',
  },
  {
    icon: BookOpen,
    title: 'PYQ library',
    copy: 'Filter by branch and semester, then download what you need.',
  },
  {
    icon: Search,
    title: 'Lost & Found',
    copy: 'Report lost items or claim found ones across campus.',
  },
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Features
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Everything campus, one product
          </h2>
          <p className="mt-3 text-muted">
            Designed as a modern student workspace — calm, fast, and useful every
            day.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-line bg-white p-5 shadow-soft"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.copy}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
