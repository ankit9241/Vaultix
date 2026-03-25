import React from 'react';
import { useNavigate } from 'react-router-dom';

const FolderBreadcrumb = ({ breadcrumb, onNavigate }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-2 text-sm">
            {breadcrumb.map((crumb, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="text-text-muted">/</span>}
                    <button 
                        onClick={() => {
                            if (onNavigate) {
                                onNavigate(crumb);
                            } else {
                                navigate(crumb.path);
                            }
                        }}
                        className="text-text-secondary hover:text-primary transition-colors"
                    >
                        {crumb.name}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
};

export default FolderBreadcrumb;
