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
import Skeleton from "../components/ui/Skeleton";

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="px-2 sm:px-3"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold text-amber-300">
              {project ? project.name : "Loading..."}
            </h1>
            <p className="mt-1 text-gray-300">
              {project
                ? project.description || "No description provided."
                : "Loading project details..."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasFolders ? (
            <Button
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Folder size={14} className="mr-1.5" />
              Create Folder
            </Button>
          ) : hasEnv ? (
            <Button
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => setIsEnvModalOpen(true)}
            >
              <Plus size={14} className="mr-1.5" />
              Add ENV
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Folder size={14} className="mr-1.5" />
                Create Folder
              </Button>
              <Button
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => setIsEnvModalOpen(true)}
              >
                <Plus size={14} className="mr-1.5" />
                Add ENV
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Sections Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="space-y-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
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
              className="cursor-pointer border-gray-700 bg-[#151a24] hover:border-amber-400/50 hover:bg-[#1a2130]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                  <Folder size={20} />
                </div>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
              <h3 className="mb-1 font-semibold text-[#f4f4f5]">
                {section.name}
              </h3>
              <p className="mb-4 text-sm text-gray-300">
                Environment variables for {section.name} environment
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{section.folderCount ?? 0} folders</span>
                <span>{section.envCount ?? section.varCount ?? 0} vars</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(section._id);
                  }}
                  className="px-2 text-red-400 hover:bg-red-400/10 hover:text-red-300"
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
        <Card className="py-12 text-center border-gray-700 bg-[#151a24]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#1d2433] text-gray-400">
            <Folder size={32} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[#f4f4f5]">
            No items yet
          </h3>
          <p className="mb-4 text-gray-300">
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
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-amber-300">
              Folder Name
            </label>
            <input
              type="text"
              required
              value={newSection.name}
              onChange={(e) => setNewSection({ name: e.target.value })}
              placeholder="e.g. Frontend, Backend, Staging"
              className="w-full rounded-lg border border-gray-700 bg-[#1d2433] px-4 py-3 text-[#f4f4f5] placeholder:text-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
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
