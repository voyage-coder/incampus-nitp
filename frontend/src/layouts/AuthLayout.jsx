import { Link, Outlet } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary-soft" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-accent-soft" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-3 self-start">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
            <Package className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-xl font-bold text-ink">
              InCampus
            </span>
            <span className="text-xs text-muted">NIT Patna campus OS</span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
