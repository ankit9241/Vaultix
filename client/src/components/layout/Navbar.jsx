import React from "react";
import { Search, Bell, Shield, HelpCircle } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 bg-panel border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">

      {/* Search */}
      <div className="flex items-center bg-code px-4 py-2 rounded-lg w-96 border border-border">
        <Search size={16} className="text-textMuted mr-2" />
        <input
          type="text"
          placeholder="Search variables, folders..."
          className="bg-transparent outline-none text-sm w-full text-textPrimary placeholder:text-textMuted"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Icons */}
        <div className="flex items-center gap-4 text-textMuted">
          <Bell className="cursor-pointer hover:text-white transition" size={18} />
          <Shield className="cursor-pointer hover:text-white transition" size={18} />
          <HelpCircle className="cursor-pointer hover:text-white transition" size={18} />
        </div>

        <div className="h-6 w-px bg-border" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">Ankit Kumar</p>
            <p className="text-xs text-primary uppercase">Developer</p>
          </div>

          <div className="w-10 h-10 rounded-lg bg-[#0a0e18] border border-border flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;