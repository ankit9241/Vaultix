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
  getAll: () => api.get("/projects"),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const sectionService = {
  getAllByProject: (projectId) => api.get(`/projects/${projectId}/sections`),
  getById: (id) => api.get(`/sections/${id}`),
  getChildren: (id) => api.get(`/sections/${id}/children`),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/sections`, data),
  createSection: (projectId, data) =>
    api.post(`/projects/${projectId}/sections`, data),
  update: (id, data) => api.put(`/sections/${id}`, data),
  updateSection: (id, data) => api.put(`/sections/${id}`, data),
  delete: (id) => api.delete(`/sections/${id}`),
  deleteSection: (id) => api.delete(`/sections/${id}`),
};

export const envService = {
  getAllBySection: (sectionId) => api.get(`/sections/${sectionId}/env`),
  create: (sectionId, data) => api.post(`/sections/${sectionId}/env`, data),
  getAllByProjectRoot: (projectId) => api.get(`/projects/${projectId}/env`),
  createAtProjectRoot: (projectId, data) =>
    api.post(`/projects/${projectId}/env`, data),
  update: (id, data) => api.put(`/env/${id}`, data),
  delete: (id) => api.delete(`/env/${id}`),
};

export const credentialService = {
  getAll: () => api.get("/credentials"),
  getById: (id) => api.get(`/credentials/${id}`),
  create: (data) => api.post("/credentials", data),
  update: (id, data) => api.put(`/credentials/${id}`, data),
  delete: (id) => api.delete(`/credentials/${id}`),
};

export const noteService = {
  getAll: () => api.get("/notes"),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post("/notes", data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

export default api;
