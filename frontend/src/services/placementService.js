import api from '../api/api';

export const getPlacementExperiences = async () =>
  (await api.get('/placement-experiences')).data;
export const getPlacementExperience = async (id) =>
  (await api.get(`/placement-experiences/${id}`)).data;
export const createPlacementExperience = async (payload) =>
  (await api.post('/placement-experiences', payload)).data;
export const updatePlacementExperience = async (id, payload) =>
  (await api.patch(`/placement-experiences/${id}`, payload)).data;
export const deletePlacementExperience = async (id) =>
  (await api.delete(`/placement-experiences/${id}`)).data;
