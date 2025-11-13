import React, { useState, useEffect } from "react";
import PostCard from "@/components/organisms/PostCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PostFeed = ({ 
  posts = [], 
  onVote, 
  onSave, 
  hasMore = true, 
  onLoadMore,
  loading = false,
  className 
}) => {
  const [sortBy, setSortBy] = useState("hot");
  
  const sortOptions = [
    { key: "hot", label: "Hot", icon: "Flame" },
    { key: "new", label: "New", icon: "Clock" },
    { key: "top", label: "Top", icon: "TrendingUp" },
    { key: "rising", label: "Rising", icon: "ArrowUp" }
  ];

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    // In a real app, this would trigger a new data fetch
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Sort Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          {sortOptions.map((option) => (
            <Button
              key={option.key}
              variant={sortBy === option.key ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleSortChange(option.key)}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ApperIcon name={option.icon} className="h-4 w-4" />
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onVote={onVote}
            onSave={onSave}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ApperIcon name="ArrowDown" className="h-4 w-4" />
                <span>Load More Posts</span>
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostFeed;