import { Link } from 'react-router-dom';
import { ArrowRight, Bell, CalendarDays, ShoppingBag, X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { usePreferences } from '../../context/PreferencesContext';
import { shouldShowWeeklyDigest } from '../../constants/preferences';

export default function WeeklyDigestCard({
  upcomingEvents = 0,
  newMarketplace = 0,
  newPlacements = 0,
  unreadNotifications = 0,
  resumeProgress = 0,
}) {
  const { prefs, dismissWeeklyDigest } = usePreferences();

  if (!shouldShowWeeklyDigest(prefs)) return null;

  const highlights = [
    upcomingEvents > 0 && {
      icon: CalendarDays,
      text: `${upcomingEvents} upcoming event${upcomingEvents === 1 ? '' : 's'}`,
      to: '/app/events',
    },
    newMarketplace > 0 && {
      icon: ShoppingBag,
      text: `${newMarketplace} new marketplace listing${newMarketplace === 1 ? '' : 's'} this week`,
      to: '/app/marketplace',
    },
    newPlacements > 0 && {
      icon: ArrowRight,
      text: `${newPlacements} new placement stor${newPlacements === 1 ? 'y' : 'ies'}`,
      to: '/app/placements',
    },
    unreadNotifications > 0 && {
      icon: Bell,
      text: `${unreadNotifications} unread notification${unreadNotifications === 1 ? '' : 's'}`,
      to: '/app/notifications',
    },
  ].filter(Boolean);

  const hasHighlights = highlights.length > 0;

  return (
    <Card hover={false} surface="primary" className="relative overflow-hidden">
      <button
        type="button"
        onClick={dismissWeeklyDigest}
        className="absolute right-4 top-4 rounded-xl p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
        aria-label="Dismiss weekly digest"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
        Weekly campus digest
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold text-white">
        Here&apos;s what you missed this week
      </h2>

      {hasHighlights ? (
        <ul className="mt-4 space-y-2">
          {highlights.map((item) => (
            <li key={item.text}>
              <Link
                to={item.to}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-white/85">
          Campus is quiet this week. Check back soon for events, listings, and
          placement updates.
        </p>
      )}

      {resumeProgress < 100 && (
        <p className="mt-4 text-sm text-white/85">
          Resume progress: {resumeProgress}% — finish a section to stand out in
          placements.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/app/notifications">
          <Button variant="secondary" size="sm">
            Open inbox
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={dismissWeeklyDigest}
          className="text-white hover:bg-white/10"
        >
          Dismiss for this week
        </Button>
      </div>
    </Card>
  );
}
