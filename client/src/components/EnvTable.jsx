import React from "react";
import { Eye, EyeOff, Copy, Trash2, ShieldQuestion, Edit2 } from "lucide-react";

const EnvTable = ({ envs, onReveal, onCopy, onDelete, onEdit }) => {
  const getHiddenValue = (env) => env.maskedValue ?? env.value;
  const getVisibleValue = (env) => env.actualValue ?? env.rawValue ?? env.value;

  return (
    <div className="overflow-hidden rounded-xl border border-[#3c3c3c] bg-[#1e1e1e] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#3c3c3c] bg-[#2d2d30]">
            <th className="w-[24%] px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9da5b4]">
              Key
            </th>
            <th className="w-[36%] px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9da5b4]">
              Value
            </th>
            <th className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9da5b4]">
              Description
            </th>
            <th className="w-[170px] px-4 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9da5b4]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3c3c3c]">
          {envs.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-[#6a6a6a]">
                  <ShieldQuestion size={48} strokeWidth={1.5} />
                  <p className="font-mono text-sm text-[#9da5b4]">
                    No environment variables found in this section.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            envs.map((env, index) => (
              <tr
                key={env._id}
                className="group transition-colors hover:bg-[#2a2d2e]"
              >
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-right font-mono text-[11px] text-[#6a6a6a]">
                      {index + 1}
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#4FC1FF]">
                      {env.key}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <span className="max-w-[320px] truncate font-mono text-sm text-[#CE9178]">
                      {env.revealed
                        ? getVisibleValue(env)
                        : getHiddenValue(env)}
                    </span>
                    <button
                      onClick={() => onReveal(env._id)}
                      className="rounded p-1 text-[#8a8a8a] transition-colors hover:bg-[#3c3c3c] hover:text-[#d4d4d4]"
                      title={env.revealed ? "Hide value" : "Reveal value"}
                    >
                      {env.revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3 align-top">
                  <p className="max-w-xs line-clamp-1 text-sm text-[#9da5b4]">
                    {env.description || "-"}
                  </p>
                </td>

                <td className="px-4 py-3 text-right align-top">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(env)}
                        className="rounded-md p-1.5 text-[#8a8a8a] transition-all hover:bg-[#3c3c3c] hover:text-[#dcdcaa]"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => onCopy(getVisibleValue(env))}
                      className="rounded-md p-1.5 text-[#8a8a8a] transition-all hover:bg-[#3c3c3c] hover:text-[#dcdcaa]"
                      title="Copy"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(env._id)}
                      className="rounded-md p-1.5 text-[#8a8a8a] transition-all hover:bg-[#5a1d1d] hover:text-[#f48771]"
                      title="Delete"
                    >
                      <Trash2 size={14} />
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
