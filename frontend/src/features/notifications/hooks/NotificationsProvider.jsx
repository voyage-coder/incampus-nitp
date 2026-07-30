import {
  NotificationsContext,
  useNotificationsState,
} from './useNotifications';

export default function NotificationsProvider({ children }) {
  const value = useNotificationsState();

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
