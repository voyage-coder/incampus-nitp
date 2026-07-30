import api from '../api/api';

// Clubs
export const getClubs = async () => (await api.get('/clubs')).data;
export const getClub = async (id) => (await api.get(`/clubs/${id}`)).data;

// Members
export const getClubMembers = async (id) =>
  (await api.get(`/clubs/${id}/members`)).data;
export const getMembership = async (membershipId) =>
  (await api.get(`/memberships/${membershipId}`)).data;
export const updateMemberRole = async (clubId, userId, role) =>
  (
    await api.patch(`/clubs/${clubId}/members/${userId}/role`, { role })
  ).data;
export const removeMember = async (clubId, userId) =>
  (await api.delete(`/clubs/${clubId}/members/${userId}`)).data;

// Recruitments / inductions
export const getClubRecruitments = async (clubId) =>
  (await api.get(`/clubs/${clubId}/recruitments`)).data;
export const getRecruitment = async (recruitmentId) =>
  (await api.get(`/recruitments/${recruitmentId}`)).data;
export const createRecruitment = async (clubId, payload) =>
  (await api.post(`/clubs/${clubId}/recruitments`, payload)).data;
export const updateRecruitment = async (recruitmentId, payload) =>
  (await api.patch(`/recruitments/${recruitmentId}`, payload)).data;
export const deleteRecruitment = async (recruitmentId) =>
  (await api.delete(`/recruitments/${recruitmentId}`)).data;

// Applications
export const applyToRecruitment = async (recruitmentId) =>
  (await api.post(`/recruitments/${recruitmentId}/apply`)).data;
export const getRecruitmentApplications = async (recruitmentId) =>
  (await api.get(`/recruitments/${recruitmentId}/applications`)).data;
export const getApplication = async (applicationId) =>
  (await api.get(`/applications/${applicationId}`)).data;
export const approveApplication = async (applicationId) =>
  (await api.patch(`/applications/${applicationId}/approve`)).data;
export const rejectApplication = async (applicationId) =>
  (await api.patch(`/applications/${applicationId}/reject`)).data;
