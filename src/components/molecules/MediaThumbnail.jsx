import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MediaThumbnail = ({ 
  src, 
  alt = "", 
  contentType = "image",
  className,
  onClick,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer group",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <ApperIcon 
            name={contentType === "video" ? "Play" : "Image"} 
            className="text-gray-400 h-6 w-6" 
          />
        </div>
      )}
      
      {/* Overlay for video/image indicator */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
        {contentType === "video" && (
          <div className="bg-black bg-opacity-70 rounded-full p-2">
            <ApperIcon name="Play" className="text-white h-4 w-4 fill-current" />
          </div>
        )}
        {contentType === "image" && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ApperIcon name="Expand" className="text-white h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaThumbnail;