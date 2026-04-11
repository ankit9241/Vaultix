import React from "react";

const Card = ({
  children,
  className = "",
  hover = false,
  onClick,
  padding = "normal",
}) => {
  const paddingClasses = {
    small: "p-4",
    normal: "p-5",
    large: "p-6",
  };

  const baseClasses =
    "bg-[#111217]/90 border border-gray-800 text-[#f4f4f5] rounded-xl";
  const hoverClasses = hover
    ? "transition-all duration-200 hover:border-amber-400/40 hover:bg-[#161b27] cursor-pointer"
    : "";
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
