import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CommunityPill = ({ 
  community, 
  showIcon = true, 
  size = "sm",
  className,
  onClick 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(community);
    } else {
      navigate(`/r/${community.name}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center space-x-1 hover:scale-105 transition-transform",
        className
      )}
    >
      {showIcon && (
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <ApperIcon name="Hash" className="h-2.5 w-2.5 text-white" />
        </div>
      )}
      <Badge variant="community" size={size}>
        r/{community.displayName || community.name}
      </Badge>
    </button>
  );
};

export default CommunityPill;