import api from '../api/api';

export const getMyResume = async () => (await api.get('/resume/me')).data;
export const createResume = async (payload) =>
  (await api.post('/resume', payload)).data;
export const updateResume = async (payload) =>
  (await api.patch('/resume/me', payload)).data;
export const downloadResumePdf = async (resumeId) => {
  try {
    const response = await api.get(`/resume/${resumeId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      const text = await data.text();
      try {
        const parsed = JSON.parse(text);
        const detail = parsed?.detail;
        if (typeof detail === 'string') {
          error.message = detail;
        }
      } catch {
        if (text) error.message = text;
      }
    }
    throw error;
  }
};

export const addEducation = async (resumeId, payload) =>
  (await api.post(`/resume/${resumeId}/education`, payload)).data;
export const addExperience = async (resumeId, payload) =>
  (await api.post(`/resume/${resumeId}/experience`, payload)).data;
export const addProject = async (resumeId, payload) =>
  (await api.post(`/resume/${resumeId}/project`, payload)).data;
export const addSkill = async (resumeId, payload) =>
  (await api.post(`/resume/${resumeId}/skill`, payload)).data;
export const addAchievement = async (resumeId, payload) =>
  (await api.post(`/resume/${resumeId}/achievement`, payload)).data;
export const addCertification = async (resumeId, payload) =>
  (await api.post(`/resume/${resumeId}/certification`, payload)).data;
export const addPosition = async (resumeId, payload) =>
  (await api.post(`/positions/resume/${resumeId}/position`, payload)).data;

// Resume section item routes
export const deleteEducation = async (id) =>
  (await api.delete(`/educations/${id}`)).data;
export const deleteExperience = async (id) =>
  (await api.delete(`/experiences/${id}`)).data;
export const deleteProject = async (id) =>
  (await api.delete(`/projects/${id}`)).data;
export const deleteSkill = async (id) => (await api.delete(`/skills/${id}`)).data;
export const deleteAchievement = async (id) =>
  (await api.delete(`/achievements/${id}`)).data;
export const deleteCertification = async (id) =>
  (await api.delete(`/certifications/${id}`)).data;
export const deletePosition = async (resumeId, positionId) =>
  (await api.delete(`/positions/resume/${resumeId}/position/${positionId}`))
    .data;

export const updateEducation = async (id, payload) =>
  (await api.patch(`/educations/${id}`, payload)).data;
export const updateExperience = async (id, payload) =>
  (await api.patch(`/experiences/${id}`, payload)).data;
export const updateProject = async (id, payload) =>
  (await api.patch(`/projects/${id}`, payload)).data;
export const updateSkill = async (id, payload) =>
  (await api.patch(`/skills/${id}`, payload)).data;
export const updateAchievement = async (id, payload) =>
  (await api.patch(`/achievements/${id}`, payload)).data;
export const updateCertification = async (id, payload) =>
  (await api.patch(`/certifications/${id}`, payload)).data;
export const updatePosition = async (resumeId, positionId, payload) =>
  (await api.put(`/positions/resume/${resumeId}/position/${positionId}`, payload))
    .data;
