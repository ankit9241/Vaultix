import React, { useState, useEffect } from "react";
import { Folder, Key, FileText } from "lucide-react";
import { projectService, credentialService, noteService } from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: "Projects", value: "0", icon: Folder, link: "/projects" },
    { label: "Credentials", value: "0", icon: Key, link: "/credentials" },
    { label: "Notes", value: "0", icon: FileText, link: "/notes" },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, credentials, notes] = await Promise.all([
          projectService.getAll(),
          credentialService.getAll(),
          noteService.getAll(),
        ]);

        setStats([
          { label: "Projects", value: projects.data.length.toString(), icon: Folder, link: "/projects" },
          { label: "Credentials", value: credentials.data.length.toString(), icon: Key, link: "/credentials" },
          { label: "Notes", value: notes.data.length.toString(), icon: FileText, link: "/notes" },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Architect Overview
        </h2>
        <p className="text-xs text-textMuted uppercase mt-1">
          Last synchronized just now
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">System Pulse</h3>
            <button className="text-xs text-textMuted hover:text-white">
              Clear Logs
            </button>
          </div>

          {/* Static activity (can replace later) */}
          <div className="space-y-3">
            <div className="bg-panel p-4 rounded-xl flex justify-between">
              <div>
                <p className="text-sm text-white">
                  Updated <span className="text-primary font-mono">.env</span>
                </p>
                <p className="text-xs text-textMuted">
                  Variables synchronized
                </p>
              </div>
              <span className="text-xs text-primary">Success</span>
            </div>

            <div className="bg-panel p-4 rounded-xl flex justify-between">
              <div>
                <p className="text-sm text-white">
                  Added AWS Credentials
                </p>
                <p className="text-xs text-textMuted">
                  Secure vault updated
                </p>
              </div>
              <span className="text-xs text-yellow-400">Secured</span>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* CTA */}
          <div className="bg-primary p-6 rounded-xl">
            <h4 className="text-white font-bold text-lg mb-2">
              Vault CLI Sync
            </h4>
            <p className="text-sm text-white/80 mb-4">
              Sync secrets instantly from terminal
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold">
              Install CLI
            </button>
          </div>

          {/* Health */}
          <div className="bg-card p-6 rounded-xl border border-border text-center">
            <p className="text-sm text-white mb-4">Vault Health</p>
            <div className="text-3xl font-bold text-primary">92</div>
            <p className="text-xs text-textMuted mt-2">
              Top 5% secure systems
            </p>
          </div>
        </div>
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