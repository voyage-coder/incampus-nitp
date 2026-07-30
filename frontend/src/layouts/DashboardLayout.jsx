import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LogOut,
  Menu,
  Package,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ADMIN_NAV, APP_NAV } from '../constants/navigation';
import { useAuth } from '../context/AuthContext';
import { NotificationBell, NotificationsProvider } from '../features/notifications';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { cn } from '../utils/cn';
import PageTransition from '../components/ui/PageTransition';

function NavLinkItem({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
          isActive
            ? 'bg-primary text-white shadow-glow'
            : 'text-muted hover:bg-cream hover:text-ink'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  );
}

function NavItems({ onNavigate, isAdmin }) {
  return (
    <div className="space-y-6 px-3">
      <nav className="space-y-1">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Workspace
        </p>
        {APP_NAV.map((item) => (
          <NavLinkItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      {isAdmin && (
        <nav className="space-y-1 border-t border-line pt-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Admin
          </p>
          {ADMIN_NAV.map((item) => (
            <NavLinkItem key={item.to} {...item} onNavigate={onNavigate} />
          ))}
        </nav>
      )}
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-line bg-surface lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-glow">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">InCampus</p>
            <p className="text-xs text-muted">NIT Patna</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-6">
          <NavItems isAdmin={isAdmin} />
        </div>
        <div className="border-t border-line p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-cream p-3">
            <Avatar
              name={user?.full_name}
              src={user?.profile_image}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.full_name}
              </p>
              <p className="truncate text-xs text-muted">
                {user?.branch} · Year {user?.year}
              </p>
              {isAdmin && (
                <Badge tone="accent" className="mt-1">
                  Admin
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-white lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link
                to="/app/dashboard"
                className="font-display text-lg font-bold lg:hidden"
              >
                InCampus
              </Link>
              {isAdmin && (
                <Badge tone="accent" className="hidden sm:inline-flex lg:hidden">
                  Admin
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="soft"
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => navigate('/app/admin')}
                >
                  Admin panel
                </Button>
              )}
              <NotificationBell />
              <button
                type="button"
                onClick={() => navigate('/app/profile')}
                className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Avatar
                  name={user?.full_name}
                  src={user?.profile_image}
                  size="md"
                />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-4">
                <div>
                  <p className="font-display text-lg font-bold">InCampus</p>
                  {isAdmin && (
                    <Badge tone="accent" className="mt-1">
                      Admin
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavItems
                  isAdmin={isAdmin}
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
              <div className="border-t border-line p-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      </div>
    </NotificationsProvider>
  );
}
