import React, { useState, useEffect } from "react";
import { Folder, Key, FileText } from "lucide-react";
import {
  projectService,
  credentialService,
  noteService,
} from "../services/api";
import { Link } from "react-router-dom";

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
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Architect Overview
        </h2>
        <p className="text-xs text-textMuted uppercase mt-1">
          Live project metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.link}>
            <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden group">
              {/* Icon Background */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                <stat.icon size={64} />
              </div>

              <p className="text-[10px] uppercase text-textMuted tracking-widest mb-3">
                {stat.label}
              </p>

              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">
                  {loading ? "--" : stat.value}
                </span>
                <span className="text-primary text-sm font-semibold">
                  Total
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Recent Projects</h3>

        {loading ? (
          <div className="text-textMuted text-sm">Loading projects...</div>
        ) : recentProjects.length === 0 ? (
          <div className="bg-panel p-6 rounded-xl text-textMuted text-sm">
            No projects yet. Create your first project to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProjects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <div className="bg-panel p-5 rounded-xl border border-border hover:border-primary/40 transition-all">
                  <p className="text-white font-semibold">{project.name}</p>
                  <p className="text-xs text-textMuted mt-1 line-clamp-2">
                    {project.description || "No description"}
                  </p>
                  <div className="mt-3 text-xs text-textMuted">
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
        <button className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-white rounded-xl shadow-lg hover:scale-105 transition">
          +
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
