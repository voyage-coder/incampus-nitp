import api from '../../../api/api';

export const getMyNotifications = async () =>
  (await api.get('/notifications/me')).data;

export const getUnreadCount = async () =>
  (await api.get('/notifications/me/unread-count')).data;

export const markNotificationRead = async (id) =>
  (await api.patch(`/notifications/${id}/read`)).data;

export const markAllNotificationsRead = async () =>
  (await api.patch('/notifications/me/read-all')).data;
