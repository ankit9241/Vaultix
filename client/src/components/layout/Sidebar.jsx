import React from "react";
import {
  LayoutDashboard,
  Folder,
  Key,
  FileText,
  Settings,
  Shield
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const items = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Projects", icon: Folder, path: "/projects" },
    { name: "Credentials", icon: Key, path: "/credentials" },
    { name: "Notes", icon: FileText, path: "/notes" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-panel border-r border-border flex flex-col p-4">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Vaultix</h1>
          <p className="text-[10px] text-textMuted uppercase tracking-widest">
            Developer Vault
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1">

        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
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

      {/* Bottom Status */}
      <div className="mt-auto p-3 border-t border-border">
        <div className="bg-code p-3 rounded-lg border border-border">
          <p className="text-[10px] text-textMuted uppercase mb-1">
            Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-white">Vault Secure</span>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;