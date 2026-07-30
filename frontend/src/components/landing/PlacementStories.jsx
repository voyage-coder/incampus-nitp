import { motion } from 'framer-motion';

const stories = [
  {
    company: 'Amazon',
    role: 'SDE Intern',
    note: 'Focus on DSA patterns and system design intuition early.',
  },
  {
    company: 'Flipkart',
    role: 'Business Analyst',
    note: 'Case practice + resume clarity made the difference.',
  },
  {
    company: 'Atlassian',
    role: 'Full-time',
    note: 'Projects with ownership stories beat laundry-list skills.',
  },
];

export default function PlacementStories() {
  return (
    <section id="placements" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-wide">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Placements
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Learn from seniors who already walked the path
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stories.map((story, i) => (
            <motion.article
              key={story.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft"
            >
              <p className="font-display text-2xl font-bold text-ink">
                {story.company}
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {story.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {story.note}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
