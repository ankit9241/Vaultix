import React from 'react';

const Card = ({ 
    children, 
    className = '', 
    hover = false, 
    onClick,
    padding = 'normal' 
}) => {
    const paddingClasses = {
        small: 'p-4',
        normal: 'p-5',
        large: 'p-6'
    };

    const baseClasses = 'bg-card border border-border text-text-primary rounded-xl';
    const hoverClasses = hover ? 'transition-all duration-200 hover:border-primary/40 cursor-pointer' : '';
    const paddingClass = paddingClasses[padding] || paddingClasses.normal;

    return (
        <div 
            className={`${baseClasses} ${hoverClasses} ${paddingClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
