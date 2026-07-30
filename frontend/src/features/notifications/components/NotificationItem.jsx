import { Link } from 'react-router-dom';
import {
  Bell,
  CalendarCheck,
  CheckCheck,
  ShoppingBag,
  UserCheck,
  UserX,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { timeAgo } from '../../../utils/format';
import { cn } from '../../../utils/cn';

const TYPE_META = {
  EVENT_REGISTERED: {
    icon: CalendarCheck,
    tone: 'primary',
  },
  APPLICATION_RECEIVED: {
    icon: Bell,
    tone: 'accent',
  },
  APPLICATION_APPROVED: {
    icon: UserCheck,
    tone: 'success',
  },
  APPLICATION_REJECTED: {
    icon: UserX,
    tone: 'neutral',
  },
  MARKETPLACE_INQUIRY: {
    icon: ShoppingBag,
    tone: 'primary',
  },
  SYSTEM: {
    icon: Bell,
    tone: 'neutral',
  },
};

export default function NotificationItem({ notification, onRead }) {
  const meta = TYPE_META[notification.type] || TYPE_META.SYSTEM;
  const Icon = meta.icon;

  const content = (
    <>
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
          meta.tone === 'primary' && 'bg-primary-soft text-primary',
          meta.tone === 'accent' && 'bg-accent-soft text-accent',
          meta.tone === 'success' && 'bg-success-soft text-success',
          meta.tone === 'neutral' && 'bg-cream text-muted'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-ink">{notification.title}</p>
          {!notification.is_read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{notification.message}</p>
        <p className="mt-2 text-xs text-muted">
          {timeAgo(notification.created_at)}
        </p>
      </div>
    </>
  );

  const className = cn(
    'flex w-full gap-4 px-5 py-4 text-left transition hover:bg-cream/80',
    !notification.is_read && 'bg-primary-soft/30'
  );

  if (notification.link) {
    return (
      <Link
        to={notification.link}
        className={className}
        onClick={() => {
          if (!notification.is_read) onRead(notification.id);
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (!notification.is_read) onRead(notification.id);
      }}
    >
      {content}
    </button>
  );
}

export function NotificationEmptyState() {
  return (
    <div className="rounded-3xl border border-line bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-muted">
        <CheckCheck className="h-5 w-5" />
      </div>
      <p className="mt-4 font-display text-lg font-bold text-ink">
        You&apos;re all caught up
      </p>
      <p className="mt-2 text-sm text-muted">
        Event registrations, club updates, and marketplace inquiries will appear here.
      </p>
    </div>
  );
}

export function NotificationTypeBadge({ type }) {
  const meta = TYPE_META[type] || TYPE_META.SYSTEM;
  return <Badge tone={meta.tone}>{type.replaceAll('_', ' ')}</Badge>;
}
