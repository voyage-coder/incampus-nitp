import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import Button from '../ui/Button';

export default function Footer() {
  return (
    <footer className="border-t border-line px-4 pb-10 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-wide overflow-hidden rounded-4xl border border-line bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                <Package className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-bold text-ink">
                InCampus
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-muted">
              Campus life, marketplace, placements, and academics — designed as a
              premium student product for NIT Patna.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} InCampus · NIT Patna</p>
          <div className="flex flex-wrap gap-4">
            <a href="#features" className="hover:text-ink">
              Features
            </a>
            <a href="#faq" className="hover:text-ink">
              FAQ
            </a>
            <Link to="/register" className="hover:text-ink">
              Join
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
