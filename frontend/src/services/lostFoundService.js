import api from '../api/api';

export const getLostFoundItems = async () =>
  (await api.get('/lost-found')).data;
export const getLostFoundItem = async (id) =>
  (await api.get(`/lost-found/${id}`)).data;
export const createLostFoundItem = async (payload) =>
  (await api.post('/lost-found', payload)).data;
export const updateLostFoundItem = async (id, payload) =>
  (await api.patch(`/lost-found/${id}`, payload)).data;
export const claimLostFoundItem = async (id) =>
  (await api.patch(`/lost-found/${id}/claim`)).data;
export const deleteLostFoundItem = async (id) =>
  (await api.delete(`/lost-found/${id}`)).data;

export const uploadLostFoundImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/lost-found/upload-image', form);
  return data;
};
