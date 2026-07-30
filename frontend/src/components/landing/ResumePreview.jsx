import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

export default function ResumePreview() {
  return (
    <section id="resume" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-wide items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Resume builder
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            A resume that looks ready for day one
          </h2>
          <p className="mt-3 text-muted">
            Multi-step editing, live preview, and PDF export — without fighting
            Word templates.
          </p>
          <Link to="/register" className="mt-6 inline-block">
            <Button>Build your resume</Button>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-4xl border border-line bg-white p-6 shadow-lift"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-display text-xl font-bold">Aanya Sharma</p>
              <p className="text-sm text-muted">CSE · Aspiring SDE</p>
            </div>
            <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
              72% complete
            </span>
          </div>
          <div className="space-y-3">
            {['Education', 'Experience', 'Projects', 'Skills'].map((section, i) => (
              <div key={section} className="rounded-2xl border border-line bg-cream p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{section}</span>
                  <span className="text-muted">{i < 3 ? 'Done' : 'In progress'}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: i < 3 ? '100%' : '45%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
