import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, title, children, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-in fade-in duration-300 sm:p-6">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-gray-700 bg-[#151a24] shadow-2xl animate-in zoom-in-95 duration-300 sm:rounded-[34px]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-[#151a24] px-8 py-6">
          <h3 className="text-xl font-semibold tracking-tight text-amber-300 sm:text-2xl">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition-all hover:bg-[#1d2433] hover:text-[#f4f4f5] active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
