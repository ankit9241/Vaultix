import React from "react";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (!user) return "User";
    
    // Try to get name from user object (could be from Google or registration)
    if (user.name) return user.name;
    if (user.email) {
      // Extract name from email (before @)
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return "User";
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    const names = displayName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

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
        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{getDisplayName()}</p>
            <p className="text-xs text-primary uppercase">Developer</p>
          </div>

          <div className="w-10 h-10 rounded-lg bg-[#0a0e18] border border-border flex items-center justify-center">
            <span className="text-white font-bold">{getInitials()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
