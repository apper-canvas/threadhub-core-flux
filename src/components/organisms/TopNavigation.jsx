import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import UserMenu from "@/components/molecules/UserMenu";
import ApperIcon from "@/components/ApperIcon";

const TopNavigation = ({ user }) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <ApperIcon name="MessageSquare" className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ThreadHub
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <SearchBar />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/submit")}
              className="hidden sm:flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>Create Post</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/submit")}
              className="sm:hidden"
            >
              <ApperIcon name="Plus" className="h-5 w-5" />
            </Button>

            <UserMenu user={user} />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;