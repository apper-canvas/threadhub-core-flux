import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  title = "Something went wrong", 
  message = "We encountered an error loading the content. Please try again.", 
  onRetry,
  className 
}) => {
  return (
    <Card className={`p-8 text-center ${className || ""}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md">{message}</p>
        </div>
        
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorView;