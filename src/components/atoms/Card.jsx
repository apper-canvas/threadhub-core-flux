import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ 
  children, 
  hoverable = false,
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-surface rounded-lg border border-gray-200 shadow-card transition-smooth",
        hoverable && "hover:shadow-card-hover hover:border-gray-300 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;