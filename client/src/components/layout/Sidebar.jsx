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
    <aside className="flex h-screen w-64 flex-col border-r border-gray-800 bg-[#151a24] p-4">
      <div className="flex items-start justify-between gap-3 mb-8 px-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-[#f4f4f5]">
              Envora
            </h1>
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-amber-300/75">
              Developer Vault
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-[#1b2130] text-gray-300 transition hover:border-amber-400/40 hover:text-white lg:hidden"
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
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-[#202839] text-amber-200"
                  : "text-gray-300 hover:bg-[#1d2433] hover:text-white"
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
        className="mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-[#1d2433] hover:text-white"
        title="Logout"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
