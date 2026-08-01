import api from '../api/api';

export const getMarketplaceItems = async () =>
  (await api.get('/marketplace')).data;
export const getMarketplaceItemContact = async (id) =>
  (await api.get(`/marketplace/${id}/contact`)).data;

export const recordMarketplaceView = async (id) =>
  api.post(`/marketplace/${id}/view`);
export const createMarketplaceItem = async (payload) =>
  (await api.post('/marketplace', payload)).data;
export const updateMarketplaceItem = async (id, payload) =>
  (await api.patch(`/marketplace/${id}`, payload)).data;
export const markItemSold = async (id) =>
  (await api.patch(`/marketplace/${id}/sold`)).data;
export const deleteMarketplaceItem = async (id) =>
  (await api.delete(`/marketplace/${id}`)).data;

export const uploadMarketplaceImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/marketplace/upload-image', form);
  return data;
};
