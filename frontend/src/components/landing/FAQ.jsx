import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const faqs = [
  {
    q: 'Is InCampus only for NIT Patna?',
    a: 'Yes — it’s built around NITP campus life, clubs, and student workflows.',
  },
  {
    q: 'Do I need to pay?',
    a: 'Core student features are free. Sign up with your college details and start using the workspace.',
  },
  {
    q: 'Can I sell items on the marketplace?',
    a: 'Yes. Create a listing with category, price, and details. Mark it sold when it’s gone.',
  },
  {
    q: 'How does the resume PDF work?',
    a: 'Build your resume in steps, then export a PDF from the resume builder once your profile is ready.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            Questions, answered
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className="font-semibold text-ink">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted transition',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
