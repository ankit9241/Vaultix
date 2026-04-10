import React from "react";
import { Eye, EyeOff, Copy, Trash2, ShieldQuestion, Edit2 } from "lucide-react";

const EnvTable = ({ envs, onReveal, onCopy, onDelete, onEdit }) => {
  const getHiddenValue = (env) => env.maskedValue ?? env.value;
  const getVisibleValue = (env) => env.actualValue ?? env.rawValue ?? env.value;

  return (
    <div className="bg-transparent border border-border rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-transparent border-b border-border">
            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
              Key
            </th>
            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
              Value
            </th>
            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">
              Description
            </th>
            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {envs.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <ShieldQuestion size={48} strokeWidth={1.5} />
                  <p className="font-medium text-text-secondary">
                    No environment variables found in this section.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            envs.map((env) => (
              <tr
                key={env._id}
                className="hover:bg-[#1E293B] transition-colors group"
              >
                <td className="px-6 py-5">
                  <span className="font-mono text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                    {env.key}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 group/value">
                    <span className="font-mono text-sm text-text-primary">
                      {env.revealed
                        ? getVisibleValue(env)
                        : getHiddenValue(env)}
                    </span>
                    <button
                      onClick={() => onReveal(env._id)}
                      className="text-text-muted hover:text-primary transition-colors"
                    >
                      {env.revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-text-secondary line-clamp-1 max-w-xs">
                    {env.description || "-"}
                  </p>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(env)}
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onCopy(getVisibleValue(env))}
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(env._id)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EnvTable;
