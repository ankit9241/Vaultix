import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({
  children,
  copyable = false,
  className = "",
  copyText = null,
  revealed = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy =
      copyText || (typeof children === "string" ? children : "");
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <div
        className={`rounded-lg border border-gray-700 bg-[#1d2433] p-[10px] font-mono text-[#f4f4f5] ${className} ${!revealed ? "blur-sm select-none" : ""}`}
      >
        {children}
      </div>
      {copyable && revealed && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 rounded border border-gray-700 bg-[#11151f] p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? (
            <Check size={14} className="text-amber-300" />
          ) : (
            <Copy size={14} className="text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;
