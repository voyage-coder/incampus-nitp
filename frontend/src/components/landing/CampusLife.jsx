import { motion } from 'framer-motion';

const moments = [
  {
    title: 'Morning',
    text: 'Check announcements, grab a PYQ, and plan your day before class.',
  },
  {
    title: 'Afternoon',
    text: 'Browse marketplace finds between labs and RSVP for tonight’s talk.',
  },
  {
    title: 'Evening',
    text: 'Polish your resume, read a placement story, apply to a club drive.',
  },
];

export default function CampusLife() {
  return (
    <section id="campus" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-wide gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Campus life
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Built around how students actually move through campus
          </h2>
          <p className="mt-3 text-muted">
            InCampus isn’t another notice board. It’s a daily companion for
            academics, community, and career.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {moments.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl border border-line bg-white p-5 shadow-soft"
            >
              <p className="text-sm font-semibold text-primary">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
