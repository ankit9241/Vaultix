import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Folder, Plus, Copy, Check } from "lucide-react";
import { envService, projectService, sectionService } from "../services/api";
import FolderBreadcrumb from "../components/FolderBreadcrumb";
import FolderCard from "../components/FolderCard";
import EnvModal from "../components/EnvModal";
import EnvTable from "../components/EnvTable";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import Skeleton from "../components/ui/Skeleton";

const SectionDetails = () => {
  const { projectId, sectionId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [section, setSection] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [envs, setEnvs] = useState([]);
  const [hasFolders, setHasFolders] = useState(false);
  const [hasEnv, setHasEnv] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [editingEnv, setEditingEnv] = useState(null);

  const maskValue = (value = "") => "•".repeat(Math.min(value.length, 12));

  const editEnv = (env) => {
    setEditingEnv(env);
    setIsEnvModalOpen(true);
  };

  const handleEnvUpdated = async (updatedEnv) => {
    try {
      await envService.update(editingEnv._id, updatedEnv);
      setEditingEnv(null);
      setIsEnvModalOpen(false);
      await fetchData();
      return true;
    } catch (err) {
      setError(
        err.response?.data?.msg || "Failed to update environment variable",
      );
      return false;
    }
  };

  const breadcrumb = [
    { name: "Projects", path: "/projects" },
    { name: project?.name || "Loading...", path: `/projects/${projectId}` },
    {
      name: section?.name || "Loading...",
      path: `/projects/${projectId}/sections/${sectionId}`,
    },
  ];

  useEffect(() => {
    fetchData();
  }, [projectId, sectionId]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [projectRes, sectionRes, allSectionsRes, envRes] =
        await Promise.all([
          projectService.getById(projectId),
          sectionService.getById(sectionId),
          sectionService.getAllByProject(projectId),
          envService.getAllBySection(sectionId),
        ]);

      setProject(projectRes.data);
      setSection(sectionRes.data);

      const childFolders = (allSectionsRes.data || []).filter(
        (node) => node.parentId === sectionId && node.type === "folder",
      );
      const childFoldersWithCounts = await Promise.all(
        childFolders.map(async (folder) => {
          const folderCount = (allSectionsRes.data || []).filter(
            (node) => node.parentId === folder._id && node.type === "folder",
          ).length;

          let envCount = 0;
          try {
            const folderEnvRes = await envService.getAllBySection(folder._id);
            envCount = (folderEnvRes.data || []).length;
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

      const childEnvs = (envRes.data || []).map((env) => ({
        ...env,
        revealed: false,
        rawValue: env.value || "",
        actualValue: env.value || "",
        maskedValue: maskValue(env.value || ""),
      }));

      setSubfolders(childFoldersWithCounts);
      setEnvs(childEnvs);
      setHasFolders(childFoldersWithCounts.length > 0);
      setHasEnv(childEnvs.length > 0);
    } catch (err) {
      console.error("Failed to fetch section details", err);
      setError("Failed to load section data");
      setSubfolders([]);
      setEnvs([]);
      setHasFolders(false);
      setHasEnv(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
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
        name: newFolder.name,
        type: "folder",
        parentId: sectionId,
      });

      setIsFolderModalOpen(false);
      setNewFolder({ name: "" });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create folder");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnvCreated = async (newEnvs) => {
    if (hasFolders) {
      setError("Cannot add env when folders exist");
      return false;
    }

    try {
      for (const env of newEnvs) {
        await envService.create(sectionId, {
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
      <FolderBreadcrumb breadcrumb={breadcrumb} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="px-2 sm:px-3"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold text-amber-300">
              {section?.name || "Loading..."}
            </h1>
            <p className="mt-1 text-gray-300">
              Environment variables and subfolders
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {hasFolders ? (
            <Button
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => setIsFolderModalOpen(true)}
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
                onClick={() => setIsFolderModalOpen(true)}
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

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : hasFolders ? (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#f4f4f5]">
            Subfolders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subfolders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onNavigate={(folderId) =>
                  navigate(`/projects/${projectId}/sections/${folderId}`)
                }
                onEdit={() => {}}
                onDelete={async (folderId) => {
                  if (window.confirm("Delete this folder?")) {
                    await sectionService.delete(folderId);
                    await fetchData();
                  }
                }}
              />
            ))}
          </div>
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
            onCopy={async (text) => navigator.clipboard.writeText(text)}
            onDelete={async (id) => {
              if (window.confirm("Delete this environment variable?")) {
                await envService.delete(id);
                await fetchData();
              }
            }}
            onEdit={editEnv}
          />
        </div>
      ) : (
        <Card className="py-12 text-center border-gray-700 bg-[#151a24]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-[#1d2433] text-gray-400">
            <FileText size={32} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[#f4f4f5]">
            No items yet
          </h3>
          <p className="mb-4 text-gray-300">
            Create folders or add environment variables
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => setIsFolderModalOpen(true)}>
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

      <Modal
        isOpen={isFolderModalOpen}
        title="Create Folder"
        onClose={() => {
          setIsFolderModalOpen(false);
          setNewFolder({ name: "" });
        }}
      >
        <form onSubmit={handleCreateFolder} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-amber-300">
              Folder Name
            </label>
            <input
              type="text"
              required
              value={newFolder.name}
              onChange={(e) => setNewFolder({ name: e.target.value })}
              placeholder="e.g. Backend"
              className="w-full rounded-lg border border-gray-700 bg-[#1d2433] px-4 py-3 text-[#f4f4f5] placeholder:text-gray-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
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

      <EnvModal
        isOpen={isEnvModalOpen}
        onClose={() => {
          setIsEnvModalOpen(false);
          setEditingEnv(null);
        }}
        sectionId={sectionId}
        onEnvCreated={handleEnvCreated}
        onEnvUpdated={handleEnvUpdated}
        editingEnv={editingEnv}
      />
    </div>
  );
};

export default SectionDetails;
