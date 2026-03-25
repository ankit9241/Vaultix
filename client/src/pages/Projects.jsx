import React, { useState, useEffect } from "react";
import { Plus, Folder, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/api";
import Modal from "../components/ui/Modal";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.data);
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
              onClick={() => navigate(`/projects/${p._id}`)}
              className="bg-panel border border-border rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:bg-[#1c1f2a] transition-all"
            >
              <div className="flex justify-between mb-4">
                <div className="w-10 h-10 bg-[#0a0e18] rounded-lg flex items-center justify-center">
                  <Folder size={18} className="text-primary" />
                </div>
                <ChevronRight size={16} className="text-textMuted" />
              </div>

              <h3 className="font-semibold text-white">{p.name}</h3>
              <p className="text-xs text-textMuted mt-1 line-clamp-2">
                {p.description}
              </p>

              <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-textMuted">
                <span>{p.sections || 0} folders</span>
                <span>{p.envCount || 0} vars</span>
              </div>
            </div>
          ))}

          {/* Create Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="border border-dashed border-border rounded-xl flex items-center justify-center text-textMuted hover:border-primary cursor-pointer"
          >
            + Create Project
          </div>

        </div>
      ) : (
        <div className="text-center py-20 text-textMuted">
          No projects yet
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />
          <textarea
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full bg-code border border-border px-3 py-2 rounded-lg text-white"
          />
          <button className="w-full bg-primary py-2 rounded-lg font-semibold">
            Create
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;