import api from '../api/api';

export const getEvents = async () => (await api.get('/events')).data;
export const getClubEvents = async (clubId) =>
  (await api.get(`/events/clubs/${clubId}`)).data;
export const getEvent = async (id) => (await api.get(`/events/${id}`)).data;
export const createClubEvent = async (clubId, payload) =>
  (await api.post(`/events/clubs/${clubId}`, payload)).data;
export const updateEvent = async (id, payload) =>
  (await api.patch(`/events/${id}`, payload)).data;
export const deleteEvent = async (id) => (await api.delete(`/events/${id}`)).data;
export const registerForEvent = async (id) =>
  (await api.post(`/events/${id}/register`)).data;
export const getEventRegistrations = async (id) =>
  (await api.get(`/events/${id}/registrations`)).data;
