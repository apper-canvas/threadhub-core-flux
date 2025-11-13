import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ 
  src, 
  alt = "Avatar", 
  size = "md", 
  fallback,
  className,
  ...props 
}) => {
  const sizes = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };
  
  const fallbackText = fallback || alt.charAt(0).toUpperCase();
  
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-semibold">{fallbackText}</span>
      )}
    </div>
  );
};

export default Avatar;