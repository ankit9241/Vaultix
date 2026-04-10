import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://envora.onrender.com/api" || "http://localhost:5000/api",
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const projectService = {
  getAll: () => api.get("/api/projects"),
  getById: (id) => api.get(`/api/projects/${id}`),
  create: (data) => api.post("/api/projects", data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

export const sectionService = {
  getAllByProject: (projectId) => api.get(`/api/projects/${projectId}/sections`),
  getById: (id) => api.get(`/api/sections/${id}`),
  getChildren: (id) => api.get(`/api/sections/${id}/children`),
  create: (projectId, data) =>
    api.post(`/api/projects/${projectId}/sections`, data),
  createSection: (projectId, data) =>
    api.post(`/api/projects/${projectId}/sections`, data),
  update: (id, data) => api.put(`/api/sections/${id}`, data),
  updateSection: (id, data) => api.put(`/api/sections/${id}`, data),
  delete: (id) => api.delete(`/api/sections/${id}`),
  deleteSection: (id) => api.delete(`/api/sections/${id}`),
};

export const envService = {
  getAllBySection: (sectionId) => api.get(`/api/sections/${sectionId}/env`),
  create: (sectionId, data) => api.post(`/api/sections/${sectionId}/env`, data),
  getAllByProjectRoot: (projectId) => api.get(`/api/projects/${projectId}/env`),
  createAtProjectRoot: (projectId, data) =>
    api.post(`/api/projects/${projectId}/env`, data),
  update: (id, data) => api.put(`/api/env/${id}`, data),
  delete: (id) => api.delete(`/api/env/${id}`),
};

export const credentialService = {
  getAll: () => api.get("/api/credentials"),
  getById: (id) => api.get(`/api/credentials/${id}`),
  create: (data) => api.post("/api/credentials", data),
  update: (id, data) => api.put(`/api/credentials/${id}`, data),
  delete: (id) => api.delete(`/api/credentials/${id}`),
};

export const noteService = {
  getAll: () => api.get("/api/notes"),
  getById: (id) => api.get(`/api/notes/${id}`),
  create: (data) => api.post("/api/notes", data),
  update: (id, data) => api.put(`/api/notes/${id}`, data),
  delete: (id) => api.delete(`/api/notes/${id}`),
};

export default api;
