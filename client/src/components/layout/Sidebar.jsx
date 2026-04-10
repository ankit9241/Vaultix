import React from "react";
import {
  LayoutDashboard,
  Folder,
  Key,
  FileText,
  Shield,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();
  const items = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Projects", icon: Folder, path: "/projects" },
    { name: "Credentials", icon: Key, path: "/credentials" },
    { name: "Notes", icon: FileText, path: "/notes" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 h-dvh bg-panel border-r border-border flex flex-col p-4 overflow-y-auto overscroll-contain">
      <div className="flex items-start justify-between gap-3 mb-8 px-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate">Envora</h1>
            <p className="text-[10px] text-textMuted uppercase tracking-widest truncate">
              Developer Vault
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden h-9 w-9 rounded-lg border border-border bg-code flex items-center justify-center text-textSecondary hover:text-white hover:bg-[#1E293B] transition"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1 flex-1 min-h-0">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                isActive
                  ? "bg-[#1E293B] text-primary"
                  : "text-textSecondary hover:bg-[#1E293B] hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-textSecondary hover:bg-[#1E293B] hover:text-white transition-colors"
        title="Logout"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
