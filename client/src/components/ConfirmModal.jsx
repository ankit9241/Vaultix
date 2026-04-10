import React from "react";
import { X, AlertTriangle } from "lucide-react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Delete", 
  message = "Are you sure you want to delete this item?", 
  confirmText = "Delete", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-400",
      buttonColor: "bg-red-600 hover:bg-red-700 text-white",
      borderColor: "border-red-900/20",
      bgColor: "bg-panel",
      textColor: "text-white",
      mutedTextColor: "text-textMuted",
      cancelButtonColor: "text-textMuted hover:bg-gray-800"
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-400", 
      buttonColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
      borderColor: "border-yellow-900/20",
      bgColor: "bg-panel",
      textColor: "text-white",
      mutedTextColor: "text-textMuted",
      cancelButtonColor: "text-textMuted hover:bg-gray-800"
    },
    info: {
      icon: AlertTriangle,
      iconColor: "text-blue-400",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white", 
      borderColor: "border-blue-900/20",
      bgColor: "bg-panel",
      textColor: "text-white",
      mutedTextColor: "text-textMuted",
      cancelButtonColor: "text-textMuted hover:bg-gray-800"
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.danger;
  const Icon = currentStyle.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className={`${currentStyle.bgColor} rounded-xl shadow-2xl border ${currentStyle.borderColor} overflow-hidden backdrop-blur-sm`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${currentStyle.borderColor}`}>
            <div className="flex items-center gap-3">
              <Icon className={`w-6 h-6 ${currentStyle.iconColor}`} />
              <h3 className={`text-lg font-semibold ${currentStyle.textColor}`}>{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-textMuted" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className={`${currentStyle.mutedTextColor} leading-relaxed`}>{message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 bg-code border-t border-border">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentStyle.cancelButtonColor}`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentStyle.buttonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
