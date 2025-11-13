import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/formatNumber";
import { formatTimeAgo } from "@/utils/formatTime";
import ApperIcon from "@/components/ApperIcon";
import CommunityPill from "@/components/molecules/CommunityPill";
import VoteControls from "@/components/molecules/VoteControls";
import MediaThumbnail from "@/components/molecules/MediaThumbnail";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const PostCard = ({ 
  post, 
  onVote, 
  onSave,
  className 
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on interactive elements
    if (e.target.closest("button") || e.target.closest("a")) return;
    navigate(`/r/${post.community}/comments/${post.id}`);
  };

  const handleVote = (voteType) => {
    onVote?.(post.id, voteType);
  };

  const handleSave = () => {
    onSave?.(post.id);
  };

  const getContentPreview = () => {
    if (post.contentType === "link") {
      try {
        const url = new URL(post.content);
        return url.hostname;
      } catch {
        return post.content;
      }
    }
    return post.content?.substring(0, 200) + (post.content?.length > 200 ? "..." : "");
  };

  return (
    <Card 
      hoverable 
      className={cn("p-4 transition-all duration-200", className)}
      onClick={handleCardClick}
    >
      <div className="flex space-x-3">
        {/* Vote Controls */}
        <div className="flex-shrink-0">
          <VoteControls
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.userVote}
            onVote={handleVote}
            size="md"
            orientation="vertical"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
<Link 
              to={`/r/${post.community}`}
              className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors duration-150 cursor-pointer"
            >
              r/{post.community}
            </Link>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Posted by</span>
              <button 
                className="hover:underline font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${post.author}`);
                }}
              >
                u/{post.author}
              </button>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          {/* Content */}
          <div className="flex space-x-3">
            <div className="flex-1">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                {post.title}
              </h3>

              {/* Content Preview */}
              {post.content && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {getContentPreview()}
                </p>
              )}

              {/* Link Preview */}
              {post.contentType === "link" && (
                <div className="text-xs text-gray-500 mb-3 flex items-center space-x-1">
                  <ApperIcon name="ExternalLink" className="h-3 w-3" />
                  <span>{new URL(post.content).hostname}</span>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            {(post.thumbnailUrl || post.contentType === "image" || post.contentType === "video") && (
              <div className="flex-shrink-0">
                <MediaThumbnail
                  src={post.thumbnailUrl}
                  alt={post.title}
                  contentType={post.contentType}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/r/${post.community}/comments/${post.id}`);
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center space-x-4 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/r/${post.community}/comments/${post.id}`);
              }}
            >
              <ApperIcon name="MessageSquare" className="h-4 w-4 mr-1" />
              <span>{formatNumber(post.commentCount)} comments</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                // Share functionality would go here
              }}
            >
              <ApperIcon name="Share" className="h-4 w-4 mr-1" />
              <span>Share</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-500 hover:text-gray-700",
                post.saved && "text-primary"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              <ApperIcon 
                name={post.saved ? "Bookmark" : "BookmarkPlus"} 
                className="h-4 w-4 mr-1" 
              />
              <span>{post.saved ? "Saved" : "Save"}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;