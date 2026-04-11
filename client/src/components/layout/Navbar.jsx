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
      const emailName = user.email.split("@")[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }

    return "User";
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    const names = displayName.split(" ");
    if (names.length >= 2) {
      return (
        names[0].charAt(0).toUpperCase() +
        names[names.length - 1].charAt(0).toUpperCase()
      );
    }
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-[#181d28]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Search */}
      <div className="flex w-full max-w-md items-center rounded-lg border border-gray-700 bg-[#11161f] px-4 py-2.5">
        <Search size={16} className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Search variables, folders..."
          className="w-full bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-500"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#f4f4f5]">
              {getDisplayName()}
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-amber-300/85">
              Developer
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-[#11161f]">
            <span className="font-semibold text-[#f4f4f5]">
              {getInitials()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
