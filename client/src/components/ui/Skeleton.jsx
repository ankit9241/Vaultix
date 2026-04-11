import React from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#202839] ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
