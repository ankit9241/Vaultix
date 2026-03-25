import React, { useState } from "react";
import {
  Globe,
  Mail,
  Lock,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";

const CredentialCard = ({ credential, onDelete }) => {
  const [revealed, setRevealed] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-600/5 transition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-600 transition-colors"></div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-indigo-50 transition-colors text-slate-400 group-hover:text-indigo-600">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {credential.title}
            </h3>
            {credential.website && (
              <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">
                {credential.website}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(credential._id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-3 pb-4 border-b border-slate-50">
        <div className="flex items-center justify-between group/field">
          <div className="flex items-center gap-2 text-slate-500">
            <Mail size={14} />
            <span className="text-sm font-medium truncate max-w-[120px]">
              {credential.emailOrPhone || "N/A"}
            </span>
          </div>
          <button
            onClick={() => handleCopy(credential.emailOrPhone)}
            className="p-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all opacity-0 group-hover/field:opacity-100"
          >
            Copy
          </button>
        </div>

        <div className="flex items-center justify-between group/field">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock size={14} />
            <span className="text-sm font-mono font-semibold text-slate-700">
              {revealed
                ? credential.actualPassword || "PASSWORD_REVEAL_ERROR"
                : credential.password || "••••••••"}
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity">
            <button
              onClick={() => setRevealed(!revealed)}
              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={() =>
                handleCopy(
                  revealed ? credential.actualPassword : credential.password,
                )
              }
              className="p-1 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {credential.notes && (
        <div className="mt-4 flex gap-2 items-start">
          <FileText size={14} className="text-slate-300 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {credential.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default CredentialCard;
