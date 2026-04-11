import React from "react";
import { useNavigate } from "react-router-dom";

const FolderBreadcrumb = ({ breadcrumb, onNavigate }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 text-sm">
      {breadcrumb.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500">/</span>}
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate(crumb);
              } else {
                navigate(crumb.path);
              }
            }}
            className="text-gray-300 transition-colors hover:text-amber-300"
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FolderBreadcrumb;
