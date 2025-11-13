import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No posts yet", 
  message = "Be the first to share something with this community!", 
  actionLabel = "Create Post",
  actionIcon = "Plus",
  onAction,
  className 
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate("/submit");
    }
  };

  return (
    <Card className={`p-12 text-center ${className || ""}`}>
      <div className="flex flex-col items-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name="MessageSquare" className="h-12 w-12 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md leading-relaxed">{message}</p>
        </div>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleAction}
          className="flex items-center space-x-2 px-6"
        >
          <ApperIcon name={actionIcon} className="h-5 w-5" />
          <span>{actionLabel}</span>
        </Button>
        
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" className="h-4 w-4" />
            <span>Join communities</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="h-4 w-4" />
            <span>Discover trending</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Bookmark" className="h-4 w-4" />
            <span>Save favorites</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Empty;