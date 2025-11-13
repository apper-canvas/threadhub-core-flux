import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatNumber } from "@/utils/formatNumber";
import { cn } from "@/utils/cn";

const VoteControls = ({ 
  upvotes = 0, 
  downvotes = 0, 
  userVote = null, 
  onVote,
  size = "md",
  orientation = "vertical",
  className 
}) => {
  const voteScore = upvotes - downvotes;
  
  const handleUpvote = () => {
    onVote?.(userVote === "up" ? null : "up");
  };
  
  const handleDownvote = () => {
    onVote?.(userVote === "down" ? null : "down");
  };

  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;
  const buttonSize = size === "sm" ? "sm" : "icon";

  const scoreColor = userVote === "up" ? "text-upvote" : 
                    userVote === "down" ? "text-downvote" : 
                    voteScore > 0 ? "text-gray-700" :
                    voteScore < 0 ? "text-gray-500" : "text-gray-600";

  return (
    <div
      className={cn(
        "flex items-center",
        orientation === "vertical" ? "flex-col space-y-1" : "flex-row space-x-2",
        className
      )}
    >
      <Button
        variant={userVote === "up" ? "upvote-active" : "upvote"}
        size={buttonSize}
        onClick={handleUpvote}
        className="vote-arrow group"
      >
        <ApperIcon 
          name="ChevronUp" 
          size={iconSize}
          className="transition-transform group-hover:scale-110"
        />
      </Button>

      <span className={cn(
        "font-semibold text-sm px-1 min-w-[2rem] text-center",
        scoreColor
      )}>
        {formatNumber(voteScore)}
      </span>

      <Button
        variant={userVote === "down" ? "downvote-active" : "downvote"}
        size={buttonSize}
        onClick={handleDownvote}
        className="vote-arrow group"
      >
        <ApperIcon 
          name="ChevronDown" 
          size={iconSize}
          className="transition-transform group-hover:scale-110"
        />
      </Button>
    </div>
  );
};

export default VoteControls;