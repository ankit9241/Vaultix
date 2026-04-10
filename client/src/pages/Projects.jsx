import React, { useState, useEffect } from "react";
import { Plus, Folder, Edit2, Trash2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { envService, projectService, sectionService } from "../services/api";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ConfirmModal";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: "project",
    itemName: ""
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
    const project = projects.find(p => p._id === projectId);
    setConfirmModal({
      isOpen: true,
      itemId: projectId,
      itemType: "project",
      itemName: project?.name || "this project"
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
        itemName: ""
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-sm text-textMuted">Your vault workspaces</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-textMuted text-sm">Loading...</div>
      ) : projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-panel border border-border rounded-xl p-5 hover:border-primary/40 hover:bg-[#1c1f2a] transition-all"
            >
              <div className="flex justify-between mb-4">
                <div className="w-10 h-10 bg-[#0a0e18] rounded-lg flex items-center justify-center">
                  <Folder size={18} className="text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(p);
                    }}
                    className="p-1 hover:bg-[#1c1f2a] rounded"
                    title="Edit"
                  >
                    <Edit2 size={14} className="text-textMuted" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(p._id, e)}
                    className="p-1 hover:bg-red-500/20 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div onClick={() => navigate(`/projects/${p._id}`)}>
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="text-xs text-textMuted mt-1 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-textMuted">
                  <span>{p.folderCount ?? p.sections ?? 0} folders</span>
                  <span>{p.envCount ?? 0} vars</span>
                </div>
              </div>
            </div>
          ))}

          {/* Create Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="border border-dashed border-border rounded-xl flex items-center justify-center text-textMuted hover:border-primary cursor-pointer min-h-[180px] bg-panel/40 hover:bg-[#1c1f2a] transition-all"
          >
            + Create Project
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-panel/80 p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.9),transparent_45%)]" />
          <div className="relative flex flex-col items-center text-center gap-5 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl border border-border bg-[#0a0e18] flex items-center justify-center shadow-lg shadow-black/20">
              <Folder size={28} className="text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                No projects yet
              </h2>
              <p className="text-sm md:text-base text-textMuted leading-6">
                Create your first vault workspace to organize environment
                variables, folders, and secure notes in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary px-5 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20"
              >
                <Plus size={16} />
                New Project
              </button>
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-[#0a0e18] text-textMuted text-sm">
                <Sparkles size={14} className="text-primary" />
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
            className="w-full bg-code border border-border px-4 py-3 rounded-lg text-white"
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
            className="w-full bg-code border border-border px-4 py-3 rounded-lg text-white"
          />
          <button className="w-full bg-primary py-2 rounded-lg font-semibold">
            {editingProject ? "Update" : "Create"}
          </button>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({
          ...confirmModal,
          isOpen: false,
          itemId: null,
          itemName: ""
        })}
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
