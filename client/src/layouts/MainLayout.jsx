import React from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-background font-sans text-text-primary relative">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <Sidebar onClose={closeSidebar} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-4 bottom-4 z-30 lg:hidden h-12 w-12 rounded-full bg-primary text-white shadow-lg shadow-black/30 flex items-center justify-center border border-white/10"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>
    </div>
  );
};

export default MainLayout;
