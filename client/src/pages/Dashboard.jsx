import React, { useState, useEffect } from "react";
import { Folder, Key, FileText } from "lucide-react";
import {
  projectService,
  credentialService,
  noteService,
} from "../services/api";
import { Link } from "react-router-dom";
import Skeleton from "../components/ui/Skeleton";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Projects", value: "0", icon: Folder, link: "/projects" },
    { label: "Credentials", value: "0", icon: Key, link: "/credentials" },
    { label: "Notes", value: "0", icon: FileText, link: "/notes" },
  ]);
  const [recentProjects, setRecentProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projects, credentials, notes] = await Promise.all([
          projectService.getAll(),
          credentialService.getAll(),
          noteService.getAll(),
        ]);

        const projectList = projects.data || [];
        setRecentProjects(projectList.slice(0, 5));

        setStats([
          {
            label: "Projects",
            value: projectList.length.toString(),
            icon: Folder,
            link: "/projects",
          },
          {
            label: "Credentials",
            value: (credentials.data || []).length.toString(),
            icon: Key,
            link: "/credentials",
          },
          {
            label: "Notes",
            value: (notes.data || []).length.toString(),
            icon: FileText,
            link: "/notes",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#f4f4f5]">
          Architect Overview
        </h2>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-300/80">
          Live project metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-800/90 bg-[#111217]/90 p-6"
              >
                <Skeleton className="mb-3 h-3 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            ))
          : stats.map((stat, i) => (
              <Link key={i} to={stat.link}>
                <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-800/90 bg-[#111217]/90 p-6 shadow-xl shadow-black/20 transition-all duration-200 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-black/30">
                  {/* Icon Background */}
                  <div className="absolute right-0 top-0 p-4 text-amber-300 opacity-[0.08] transition-opacity duration-200 group-hover:opacity-[0.18]">
                    <stat.icon size={64} />
                  </div>

                  <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-gray-500">
                    {stat.label}
                  </p>

                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-semibold text-[#f4f4f5]">
                      {stat.value}
                    </span>
                    <span className="text-sm font-medium text-amber-300/90">
                      Total
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#f4f4f5]">
          Recent Projects
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-800 bg-[#111217]/90 p-5"
              >
                <Skeleton className="mb-2 h-5 w-40" />
                <Skeleton className="mb-1 h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-[#111217]/80 p-6 text-sm text-gray-400">
            No projects yet. Create your first project to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentProjects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <div className="rounded-2xl border border-gray-800 bg-[#111217]/90 p-5 transition-all duration-200 hover:border-amber-400/40 hover:bg-[#151821]">
                  <p className="font-semibold text-[#f4f4f5]">{project.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                    {project.description || "No description"}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link to="/projects">
        <button className="fixed bottom-10 right-10 grid h-14 w-14 place-items-center rounded-xl bg-amber-400 text-2xl font-medium text-[#0e0e10] shadow-xl shadow-black/30 transition duration-200 hover:opacity-90">
          +
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
