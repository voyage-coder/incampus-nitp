import api from '../api/api';

export const getPyqs = async (params = {}) =>
  (await api.get('/pyqs', { params })).data;
export const getPyq = async (id) => (await api.get(`/pyqs/${id}`)).data;
export const createPyq = async (payload) =>
  (await api.post('/pyqs', payload)).data;
export const updatePyq = async (id, payload) =>
  (await api.patch(`/pyqs/${id}`, payload)).data;
export const deletePyq = async (id) => (await api.delete(`/pyqs/${id}`)).data;
