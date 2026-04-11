import React from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="relative flex min-h-screen bg-[#0e0e10] font-sans text-[#f4f4f5]">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Desktop Sidebar - always visible */}
      <div className="hidden lg:block fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-4 left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-gray-700 bg-[#1d2433] text-gray-100 shadow-lg shadow-black/30 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>
    </div>
  );
};

export default MainLayout;
