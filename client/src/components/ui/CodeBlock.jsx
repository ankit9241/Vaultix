import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ 
  children, 
  copyable = false, 
  className = '', 
  copyText = null,
  revealed = true 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = copyText || (typeof children === 'string' ? children : '');
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <div className={`bg-code text-text-primary font-mono border border-border rounded-lg p-[10px] ${className} ${!revealed ? 'blur-sm select-none' : ''}`}>
        {children}
      </div>
      {copyable && revealed && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded bg-panel border border-border opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check size={14} className="text-green-600" />
          ) : (
            <Copy size={14} className="text-text-muted" />
          )}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;
