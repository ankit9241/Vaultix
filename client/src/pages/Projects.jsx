import React, { useState, useEffect } from "react";
import {
  Plus,
  Folder,
  Edit2,
  Trash2,
  Sparkles,
  Search,
  Boxes,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { envService, projectService, sectionService } from "../services/api";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ConfirmModal";
import Skeleton from "../components/ui/Skeleton";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: "project",
    itemName: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getAll();
      const enrichedProjects = await Promise.all(
        (res.data || []).map(async (project) => {
          try {
            const sectionsRes = await sectionService.getAllByProject(
              project._id,
            );
            const allSections = sectionsRes.data || [];

            const rootFolderCount = allSections.filter(
              (section) => !section.parentId && section.type === "folder",
            ).length;

            let envCount = 0;
            if (allSections.length > 0) {
              const envCounts = await Promise.all(
                allSections.map(async (section) => {
                  try {
                    const envRes = await envService.getAllBySection(
                      section._id,
                    );
                    return (envRes.data || []).length;
                  } catch {
                    return 0;
                  }
                }),
              );
              envCount += envCounts.reduce((sum, value) => sum + value, 0);
            }

            // Backward compatible: root env endpoint may be unavailable.
            try {
              const rootEnvRes = await envService.getAllByProjectRoot(
                project._id,
              );
              envCount += (rootEnvRes.data || []).length;
            } catch {
              // Ignore when endpoint is not available.
            }

            return {
              ...project,
              folderCount: rootFolderCount,
              envCount,
            };
          } catch {
            return {
              ...project,
              folderCount: project.folderCount ?? project.sections ?? 0,
              envCount: project.envCount ?? 0,
            };
          }
        }),
      );

      setProjects(enrichedProjects);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await projectService.create(newProject);
    setIsModalOpen(false);
    setNewProject({ name: "", description: "" });
    fetchProjects();
  };

  const handleEdit = async (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await projectService.update(editingProject._id, editingProject);
    setIsModalOpen(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    const project = projects.find((p) => p._id === projectId);
    setConfirmModal({
      isOpen: true,
      itemId: projectId,
      itemType: "project",
      itemName: project?.name || "this project",
    });
  };

  const confirmDelete = async () => {
    if (confirmModal.itemId) {
      await projectService.delete(confirmModal.itemId);
      fetchProjects();
      setConfirmModal({
        isOpen: false,
        itemId: null,
        itemType: "project",
        itemName: "",
      });
    }
  };

  const filteredProjects = projects.filter((project) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      project.name?.toLowerCase().includes(q) ||
      project.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#f4f4f5]">
            Projects
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-300/80">
            Your vault workspaces
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-[#0e0e10] transition duration-200 hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <Plus size={14} className="sm:h-4 sm:w-4" />
          New Project
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-800 bg-[#111217]/90 p-3 md:flex-row md:items-center md:justify-between md:p-4">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-gray-700 bg-[#1a2030] py-2.5 pl-10 pr-3 text-sm text-[#f4f4f5] outline-none transition focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/15"
          />
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-gray-400">
          <Boxes size={14} className="text-amber-300" />
          Showing {filteredProjects.length} of {projects.length}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-800/90 bg-[#111217]/90 p-5"
            >
              <div className="mb-4 flex justify-between">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="mb-2 h-5 w-2/3" />
              <Skeleton className="mb-1 h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p, index) => (
            <div
              key={p._id}
              className="group relative overflow-hidden rounded-2xl border border-gray-800/90 bg-[#111217]/95 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/45 hover:shadow-amber-500/10"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/10 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />

              <div className="flex justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-[#171d2a]">
                  <Folder size={18} className="text-amber-300" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(p);
                    }}
                    className="rounded p-1 text-gray-400 transition-colors hover:bg-[#222b3d] hover:text-white"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(p._id, e)}
                    className="rounded p-1 text-red-400 transition-colors hover:bg-red-500/20"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div
                onClick={() => navigate(`/projects/${p._id}`)}
                className="relative z-10 cursor-pointer"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-amber-200">
                  Workspace
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[#f4f4f5]">
                  {p.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
                  {p.description}
                </p>

                <div className="mt-4 flex justify-between border-t border-gray-800 pt-4 text-xs text-gray-400">
                  <span className="rounded-md bg-[#171d2a] px-2 py-1">
                    {p.folderCount ?? p.sections ?? 0} folders
                  </span>
                  <span className="rounded-md bg-[#171d2a] px-2 py-1">
                    {p.envCount ?? 0} vars
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111217]/85 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(17,24,39,0.92),transparent_45%)]" />
          <div className="relative flex flex-col items-center text-center gap-4 max-w-xl mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-700 bg-[#151a24]">
              <Search size={24} className="text-amber-300" />
            </div>
            <h2 className="text-2xl font-semibold text-[#f4f4f5]">
              No matching projects
            </h2>
            <p className="text-sm text-gray-400 leading-6">
              Try a different keyword or clear search to see all workspaces.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="rounded-lg border border-gray-700 bg-[#151a24] px-4 py-2 text-sm text-gray-200 transition hover:border-amber-300/50 hover:text-amber-200"
            >
              Clear search
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111217]/85 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(17,24,39,0.92),transparent_45%)]" />
          <div className="relative flex flex-col items-center text-center gap-5 max-w-xl mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-700 bg-[#151a24] shadow-lg shadow-black/20">
              <Folder size={28} className="text-amber-300" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[#f4f4f5]">
                No projects yet
              </h2>
              <p className="text-sm md:text-base text-gray-400 leading-6">
                Create your first vault workspace to organize environment
                variables, folders, and secure notes in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-[#0e0e10] shadow-lg shadow-amber-400/20 transition duration-200 hover:opacity-90 sm:px-5 sm:py-3 sm:text-sm"
              >
                <Plus size={14} className="sm:h-4 sm:w-4" />
                New Project
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-[#151a24] px-4 py-3 text-sm text-gray-400">
                <Sparkles size={14} className="text-amber-300" />
                Start with a clean workspace
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
          setNewProject({ name: "", description: "" });
        }}
        title={editingProject ? "Edit Project" : "Create Project"}
      >
        <form
          onSubmit={editingProject ? handleUpdate : handleCreate}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Project name"
            value={editingProject ? editingProject.name : newProject.name}
            onChange={(e) => {
              if (editingProject) {
                setEditingProject({ ...editingProject, name: e.target.value });
              } else {
                setNewProject({ ...newProject, name: e.target.value });
              }
            }}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-4 py-3 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />
          <textarea
            placeholder="Description"
            value={
              editingProject
                ? editingProject.description
                : newProject.description
            }
            onChange={(e) => {
              if (editingProject) {
                setEditingProject({
                  ...editingProject,
                  description: e.target.value,
                });
              } else {
                setNewProject({ ...newProject, description: e.target.value });
              }
            }}
            className="w-full rounded-lg border border-gray-700 bg-[#151a24] px-4 py-3 text-[#f4f4f5] outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20"
          />
          <button className="w-full rounded-lg bg-amber-400 py-2 font-semibold text-[#0e0e10] transition duration-200 hover:opacity-90">
            {editingProject ? "Update" : "Create"}
          </button>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            ...confirmModal,
            isOpen: false,
            itemId: null,
            itemName: "",
          })
        }
        onConfirm={confirmDelete}
        title={`Delete ${confirmModal.itemType}`}
        message={`Are you sure you want to delete "${confirmModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Projects;
