import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-accent text-white focus:ring-primary",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 focus:ring-gray-300",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-error hover:bg-red-700 text-white focus:ring-error",
upvote: "text-gray-500 hover:text-upvote hover:bg-orange-50 focus:ring-upvote",
    downvote: "text-gray-500 hover:text-downvote hover:bg-blue-50 focus:ring-downvote",
    "upvote-active": "text-upvote bg-orange-50 hover:bg-orange-100 focus:ring-upvote",
    "downvote-active": "text-downvote bg-blue-50 hover:bg-blue-100 focus:ring-downvote"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;