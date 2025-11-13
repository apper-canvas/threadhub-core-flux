import React from "react";
import Card from "@/components/atoms/Card";

const PostSkeleton = () => (
  <Card className="p-4">
    <div className="flex space-x-3">
      {/* Vote skeleton */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-6 h-6 bg-gray-200 rounded loading-shimmer" />
        <div className="w-8 h-4 bg-gray-200 rounded loading-shimmer" />
        <div className="w-6 h-6 bg-gray-200 rounded loading-shimmer" />
      </div>
      
      <div className="flex-1 space-y-3">
        {/* Header skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-16 h-5 bg-gray-200 rounded loading-shimmer" />
          <div className="w-2 h-2 bg-gray-200 rounded-full" />
          <div className="w-20 h-4 bg-gray-200 rounded loading-shimmer" />
          <div className="w-2 h-2 bg-gray-200 rounded-full" />
          <div className="w-16 h-4 bg-gray-200 rounded loading-shimmer" />
        </div>
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="w-full h-6 bg-gray-200 rounded loading-shimmer" />
          <div className="w-3/4 h-6 bg-gray-200 rounded loading-shimmer" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded loading-shimmer" />
          <div className="w-full h-4 bg-gray-200 rounded loading-shimmer" />
          <div className="w-2/3 h-4 bg-gray-200 rounded loading-shimmer" />
        </div>
        
        {/* Actions skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-8 bg-gray-200 rounded loading-shimmer" />
          <div className="w-16 h-8 bg-gray-200 rounded loading-shimmer" />
          <div className="w-16 h-8 bg-gray-200 rounded loading-shimmer" />
        </div>
      </div>
    </div>
  </Card>
);

const Loading = ({ count = 5, className }) => {
  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Filter tabs skeleton */}
      <Card className="p-1">
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-10 bg-gray-200 rounded loading-shimmer" />
          ))}
        </div>
      </Card>
      
      {/* Posts skeleton */}
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
};

export default Loading;