import { Bell } from 'lucide-react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ErrorState from '../../../components/ui/ErrorState';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem, {
  NotificationEmptyState,
} from '../components/NotificationItem';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
  } = useNotifications();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Personal alerts for events, club applications, and campus activity."
        actions={
          unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllRead}>
              Mark all read
            </Button>
          )
        }
      />

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      {error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && notifications.length === 0 && (
        <NotificationEmptyState />
      )}

      {!loading && !error && notifications.length > 0 && (
        <Card hover={false} className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Bell className="h-4 w-4" />
              {unreadCount > 0
                ? `${unreadCount} unread`
                : 'All caught up'}
            </div>
          </div>
          <div className="divide-y divide-line">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markRead}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
