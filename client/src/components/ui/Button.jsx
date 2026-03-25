import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    ...props 
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
    
    const variants = {
        primary: 'bg-primary hover:bg-primaryHover text-white',
        secondary: 'bg-panel border border-border text-text-secondary hover:bg-[#1E293B]',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        ghost: 'text-text-secondary hover:text-primary hover:bg-card'
    };
    
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={isDisabled}
            {...props}
        >
            {loading && (
                <Loader2 size={16} className="mr-2 animate-spin" />
            )}
            {children}
        </button>
    );
};

export default Button;
