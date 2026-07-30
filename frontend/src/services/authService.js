import api from '../api/api';

export async function loginRequest({ email, password }) {
  const body = new URLSearchParams();
  body.append('username', email);
  body.append('password', password);

  const { data } = await api.post('/auth/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
}

export async function registerRequest(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/users/me');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/users/me', payload);
  return data;
}

export async function uploadProfileImage(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.put('/users/me/profile-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getUserContact(userId) {
  const { data } = await api.get(`/users/${userId}/contact`);
  return data;
}
