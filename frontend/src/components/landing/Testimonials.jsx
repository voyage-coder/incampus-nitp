import { motion } from 'framer-motion';

const testimonials = [
  {
    quote:
      'Finally one place for fest deadlines, PYQs, and selling my old books. Feels like a real product.',
    name: 'Riya Kapoor',
    meta: 'ECE · Year 3',
  },
  {
    quote:
      'The placement stories helped me prep smarter. Resume builder is clean and actually usable.',
    name: 'Arjun Mehta',
    meta: 'CSE · Year 4',
  },
  {
    quote:
      'Club recruitments used to live in five group chats. InCampus made it discoverable.',
    name: 'Neha Singh',
    meta: 'ME · Year 2',
  },
];

export default function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Testimonials
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Students already feel the difference
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft"
            >
              <p className="text-sm leading-relaxed text-ink">“{item.quote}”</p>
              <footer className="mt-5">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-muted">{item.meta}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
