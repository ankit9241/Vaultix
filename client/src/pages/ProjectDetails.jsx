import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Folder,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { envService, projectService, sectionService } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EnvTable from "../components/EnvTable";
import EnvModal from "../components/EnvModal";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [envs, setEnvs] = useState([]);
  const [hasFolders, setHasFolders] = useState(false);
  const [hasEnv, setHasEnv] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [newSection, setNewSection] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isRootEnvApiAvailable, setIsRootEnvApiAvailable] = useState(true);
  const [copiedAll, setCopiedAll] = useState(false);

  const maskValue = (value = "") => "•".repeat(Math.min(value.length, 12));

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (hasEnv) {
      setError("Cannot create folder when env exists");
      setSubmitting(false);
      return;
    }

    try {
      await sectionService.create(projectId, {
        ...newSection,
        type: "folder",
        parentId: null,
      });
      setIsModalOpen(false);
      setNewSection({ name: "" });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create section");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnvCreated = async (newEnvs) => {
    if (hasFolders) {
      setError("Cannot add env when folders exist");
      return false;
    }

    if (!isRootEnvApiAvailable) {
      setError("Root env API is not available. Restart backend and try again.");
      return false;
    }

    try {
      for (const env of newEnvs) {
        await envService.createAtProjectRoot(projectId, {
          key: env.key,
          value: env.value,
          description: env.description,
        });
      }

      await fetchData();
      return true;
    } catch (err) {
      setError(
        err.response?.data?.msg || "Failed to create environment variable",
      );
      return false;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const pRes = await projectService.getById(projectId);
      setProject(pRes.data);
      const sRes = await sectionService.getAllByProject(projectId);

      let rootEnvsData = [];
      try {
        const eRes = await envService.getAllByProjectRoot(projectId);
        rootEnvsData = eRes.data || [];
        setIsRootEnvApiAvailable(true);
      } catch (envErr) {
        if (envErr.response?.status === 404) {
          rootEnvsData = [];
          setIsRootEnvApiAvailable(false);
        } else {
          throw envErr;
        }
      }

      const rootFolders = (sRes.data || []).filter(
        (section) => !section.parentId && section.type === "folder",
      );
      const foldersWithCounts = await Promise.all(
        rootFolders.map(async (folder) => {
          const folderCount = (sRes.data || []).filter(
            (section) =>
              section.parentId === folder._id && section.type === "folder",
          ).length;

          let envCount = 0;
          try {
            const envRes = await envService.getAllBySection(folder._id);
            envCount = (envRes.data || []).length;
          } catch {
            envCount = folder.envCount ?? folder.varCount ?? 0;
          }

          return {
            ...folder,
            folderCount,
            envCount,
            varCount: envCount,
          };
        }),
      );

      const rootEnvs = rootEnvsData.map((env) => ({
        ...env,
        revealed: false,
        rawValue: env.value || "",
        actualValue: env.value || "",
        maskedValue: maskValue(env.value || ""),
      }));

      setSections(foldersWithCounts);
      setEnvs(rootEnvs);
      setHasFolders(foldersWithCounts.length > 0);
      setHasEnv(rootEnvs.length > 0);
    } catch (err) {
      console.error("Failed to fetch project details", err);
      setError("Failed to load project data");
      setProject(null);
      setSections([]);
      setEnvs([]);
      setHasFolders(false);
      setHasEnv(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (window.confirm("Delete this section?")) {
      try {
        await sectionService.delete(id);
        setSections(sections.filter((s) => s._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCopyAllEnv = async () => {
    const envContent = envs
      .map(
        (env) =>
          `${env.key}=${env.actualValue ?? env.rawValue ?? env.value ?? ""}`,
      )
      .join("\n");

    await navigator.clipboard.writeText(envContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/projects")}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-primary">
              {project ? project.name : "Loading..."}
            </h1>
            <p className="text-text-secondary mt-1">
              {project
                ? project.description || "No description provided."
                : "Loading project details..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasFolders ? (
            <Button onClick={() => setIsModalOpen(true)}>
              <Folder size={16} className="mr-2" />
              Create Folder
            </Button>
          ) : hasEnv ? (
            <Button onClick={() => setIsEnvModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add ENV
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsModalOpen(true)}>
                <Folder size={16} className="mr-2" />
                Create Folder
              </Button>
              <Button onClick={() => setIsEnvModalOpen(true)}>
                <Plus size={16} className="mr-2" />
                Add ENV
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Sections Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg"></div>
                <div className="h-4 bg-slate-50 rounded w-3/4"></div>
                <div className="h-3 bg-slate-50 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : hasFolders ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Card
              key={section._id}
              hover
              onClick={() =>
                navigate(`/projects/${projectId}/sections/${section._id}`)
              }
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Folder size={20} />
                </div>
                <ChevronRight size={16} className="text-text-muted" />
              </div>
              <h3 className="font-semibold text-primary mb-1">
                {section.name}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Environment variables for {section.name} environment
              </p>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{section.folderCount ?? 0} folders</span>
                <span>{section.envCount ?? section.varCount ?? 0} vars</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(section._id);
                  }}
                  className="text-red-600 hover:bg-red-500/10 px-2"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : hasEnv ? (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
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
                  Copy .env
                </>
              )}
            </Button>
          </div>

          <EnvTable
            envs={envs}
            onReveal={(id) =>
              setEnvs(
                envs.map((env) =>
                  env._id === id ? { ...env, revealed: !env.revealed } : env,
                ),
              )
            }
            onCopy={async (text) => {
              await navigator.clipboard.writeText(text);
            }}
            onDelete={async (id) => {
              if (window.confirm("Delete this environment variable?")) {
                await envService.delete(id);
                setEnvs(envs.filter((env) => env._id !== id));
              }
            }}
          />
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-card rounded-lg flex items-center justify-center text-text-muted mx-auto mb-4">
            <Folder size={32} />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            No items yet
          </h3>
          <p className="text-text-secondary mb-4">
            Create folders or add environment variables at project root
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => setIsModalOpen(true)}>
              <Folder size={16} className="mr-2" />
              Create Folder
            </Button>
            <Button onClick={() => setIsEnvModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add ENV
            </Button>
          </div>
        </Card>
      )}

      {/* Create Folder Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Create Folder"
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={newSection.name}
              onChange={(e) => setNewSection({ name: e.target.value })}
              placeholder="e.g. Frontend, Backend, Staging"
              className="w-full px-4 py-3 bg-code text-text-primary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder:text-text-muted"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
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

      <EnvModal
        isOpen={isEnvModalOpen}
        onClose={() => setIsEnvModalOpen(false)}
        onEnvCreated={handleEnvCreated}
      />
    </div>
  );
};

export default ProjectDetails;
