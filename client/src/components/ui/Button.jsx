import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:ring-offset-2 focus:ring-offset-[#0e0e10] disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-amber-400 hover:opacity-90 text-[#0e0e10] font-semibold",
    secondary:
      "bg-[#151a24] border border-gray-700 text-gray-300 hover:bg-[#1d2433] hover:text-[#f4f4f5]",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    ghost: "text-gray-400 hover:text-amber-300 hover:bg-[#1d2433]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
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
      {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
