import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useNotifications } from '../hooks/useNotifications';
import { cn } from '../../../utils/cn';

export default function NotificationBell({ className }) {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn('relative', className)}
      onClick={() => navigate('/app/notifications')}
      aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
}
