import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Copy,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Folder,
  FolderOpen,
  Upload,
  FileText,
} from "lucide-react";
import { envService, sectionService, projectService } from "../services/api";
import { parseEnvContent } from "../utils/envUtils";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import CodeBlock from "../components/ui/CodeBlock";
import EnvTable from "../components/EnvTable";
import FolderCard from "../components/FolderCard";
import FolderBreadcrumb from "../components/FolderBreadcrumb";
import EnvModal from "../components/EnvModal";

const SectionDetails = () => {
  const { projectId, sectionId } = useParams();
  const navigate = useNavigate();
  const [envs, setEnvs] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState(null);
  const [project, setProject] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState([
    { name: "Projects", path: `/projects` },
    { name: "Loading...", path: `/projects/${projectId}` },
    {
      name: "Loading...",
      path: `/projects/${projectId}/sections/${sectionId}`,
    },
  ]);

  // Update breadcrumb when data is loaded
  useEffect(() => {
    if (project?.name && section?.name) {
      setBreadcrumb([
        { name: "Projects", path: `/projects` },
        { name: project.name, path: `/projects/${projectId}` },
        {
          name: section.name,
          path: `/projects/${projectId}/sections/${sectionId}`,
        },
      ]);
    }
  }, [project, section, projectId, sectionId]);

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch project details
      const projectRes = await projectService.getById(projectId);
      setProject(projectRes.data);

      // Fetch section details
      const sectionRes = await sectionService.getById(sectionId);
      setSection(sectionRes.data);

      // Fetch environment variables
      const envRes = await envService.getAllBySection(sectionId);
      setEnvs(
        envRes.data.map((e) => ({
          ...e,
          revealed: false,
          actualValue: e.value || "",
        })),
      );

      // TODO: Fetch subfolders when backend API is available
      setSubfolders([]);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Failed to load folder data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // TODO: Implement folder creation API when backend is ready
      // const folder = await folderService.create(projectId, sectionId, newFolder);

      // For now, show a message that this feature is coming soon
      setError("Folder creation will be available in the next update");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create folder");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnvCreated = async (newEnvs) => {
    try {
      // Create each environment variable via API
      const createdEnvs = [];
      for (const env of newEnvs) {
        try {
          const data = await envService.create(sectionId, {
            key: env.key,
            value: env.value,
            description: env.description,
          });

          createdEnvs.push({
            ...data.data,
            revealed: false,
            actualValue: env.value,
          });
        } catch (err) {
          console.error(`Failed to create env ${env.key}:`, err);
          // Continue with other envs even if one fails
        }
      }

      if (createdEnvs.length > 0) {
        setEnvs([...envs, ...createdEnvs]);
        return true;
      } else {
        setError("No environment variables were created");
        return false;
      }
    } catch (err) {
      setError("Failed to create environment variables");
      return false;
    }
  };

  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id) => {
    setEnvs(
      envs.map((env) =>
        env._id === id ? { ...env, revealed: !env.revealed } : env,
      ),
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this environment variable?")) {
      try {
        await envService.delete(id);
        setEnvs(envs.filter((e) => e._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete environment variable");
      }
    }
  };

  const handleFolderNavigate = (folderId) => {
    // TODO: Implement folder navigation when backend API is ready
    setError("Folder navigation will be available in the next update");
  };

  const handleCopyAllEnv = () => {
    const envContent = envs
      .map((env) => `${env.key}=${env.actualValue || env.value}`)
      .join("\n");

    navigator.clipboard
      .writeText(envContent)
      .then(() => {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy environment variables:", err);
      });
  };

  const maskValue = (value) => "•".repeat(Math.min(value.length, 12));

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <FolderBreadcrumb breadcrumb={breadcrumb} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-primary">
              {section?.name || "Loading..."}
            </h1>
            <p className="text-textSecondary mt-1">
              Environment variables and subfolders
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsFolderModalOpen(true)}>
            <Folder size={16} className="mr-2" />
            Create Folder
          </Button>
          <Button onClick={() => setIsEnvModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add ENV
          </Button>
        </div>
      </div>

      {/* Subfolders */}
      {subfolders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Subfolders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subfolders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onNavigate={handleFolderNavigate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Environment Variables */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Environment Variables
          </h2>
          {envs.length > 0 && (
            <Button
              variant="secondary"
              onClick={handleCopyAllEnv}
              className="flex items-center gap-2"
            >
              {copiedAll ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy All
                </>
              )}
            </Button>
          )}
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-card rounded w-1/3"></div>
                  <div className="h-3 bg-card rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : envs.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-card rounded-lg flex items-center justify-center text-text-muted mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              No variables yet
            </h3>
            <p className="text-textSecondary mb-4">
              Add your first environment variable to get started
            </p>
            <Button onClick={() => setIsEnvModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Variable
            </Button>
          </Card>
        ) : (
          <EnvTable
            envs={envs}
            onReveal={toggleReveal}
            onCopy={handleCopy}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={isFolderModalOpen}
        title="Create Folder"
        onClose={() => setIsFolderModalOpen(false)}
      >
        <form onSubmit={handleCreateFolder} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Folder Name
            </label>
            <input
              type="text"
              required
              value={newFolder.name}
              onChange={(e) =>
                setNewFolder({ ...newFolder, name: e.target.value })
              }
              placeholder="e.g. Development"
              className="w-full bg-code text-text-primary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-text-muted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={newFolder.description}
              onChange={(e) =>
                setNewFolder({ ...newFolder, description: e.target.value })
              }
              placeholder="What this folder contains..."
              className="w-full bg-code text-text-primary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent resize-none placeholder:text-text-muted"
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsFolderModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              Create Folder
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Environment Variable Modal */}
      <EnvModal
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
        sectionId={sectionId}
        onEnvCreated={handleEnvCreated}
      />
    </div>
  );
};

export default SectionDetails;
