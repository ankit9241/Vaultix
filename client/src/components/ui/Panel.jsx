import React from 'react';

const Panel = ({ 
  children, 
  className = '', 
  title = null,
  actions = null 
}) => {
  return (
    <div className={`bg-card border border-border text-text-primary rounded-xl ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Panel;
