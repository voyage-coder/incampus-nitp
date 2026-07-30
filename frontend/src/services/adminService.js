import api from '../api/api';

export const getAdminUsers = async () => (await api.get('/admin/users')).data;

export const updateUserRole = async (userId, role) =>
  (await api.patch(`/admin/users/${userId}/role`, { role })).data;

export const createClub = async (payload) =>
  (await api.post('/clubs', payload)).data;

export const updateClub = async (clubId, payload) =>
  (await api.patch(`/clubs/${clubId}`, payload)).data;

export const deleteClub = async (clubId) =>
  (await api.delete(`/clubs/${clubId}`)).data;
