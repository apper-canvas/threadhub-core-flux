import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="p-12 text-center max-w-lg">
        <div className="flex flex-col items-center space-y-6">
          {/* 404 Graphic */}
          <div className="relative">
            <div className="text-8xl font-bold text-gray-200 select-none">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ApperIcon name="MessageSquareX" className="h-16 w-16 text-gray-400" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
            <p className="text-gray-600 leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The link might be broken, 
              or the page may have been moved or deleted.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Home" className="h-4 w-4" />
              <span>Go Home</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-6 border-t border-gray-100 w-full">
            <p className="text-sm text-gray-500 mb-3">Or try these popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/communities")}
                className="text-primary hover:text-accent"
              >
                <ApperIcon name="Users" className="h-3 w-3 mr-1" />
                Communities
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/submit")}
                className="text-primary hover:text-accent"
              >
                <ApperIcon name="Plus" className="h-3 w-3 mr-1" />
                Create Post
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/search?q=trending")}
                className="text-primary hover:text-accent"
              >
                <ApperIcon name="TrendingUp" className="h-3 w-3 mr-1" />
                Trending
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;