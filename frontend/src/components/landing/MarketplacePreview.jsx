import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const items = [
  { title: 'Clean Code book', price: '₹350', tag: 'Books' },
  { title: 'Study lamp', price: '₹480', tag: 'Electronics' },
  { title: 'Cycle · good condition', price: '₹2,800', tag: 'Others' },
];

export default function MarketplacePreview() {
  return (
    <section id="marketplace" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-wide overflow-hidden rounded-4xl border border-line bg-white p-6 shadow-card sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Marketplace
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">
              Trade with people you already trust
            </h2>
            <p className="mt-3 text-muted">
              List items in seconds, filter by category, and wishlist what you
              need before fest season.
            </p>
          </div>
          <Link to="/register">
            <Button>Explore marketplace</Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-line bg-cream p-4"
            >
              <div className="mb-4 h-28 rounded-2xl bg-primary-soft" />
              <p className="text-xs font-semibold text-muted">{item.tag}</p>
              <p className="mt-1 font-semibold text-ink">{item.title}</p>
              <p className="mt-2 font-display text-lg font-bold text-primary">
                {item.price}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
