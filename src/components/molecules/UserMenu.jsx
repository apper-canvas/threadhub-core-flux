import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const UserMenu = ({ user, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { 
      icon: "User", 
      label: "Profile", 
      onClick: () => navigate(`/user/${user?.username}`) 
    },
    { 
      icon: "Settings", 
      label: "Settings", 
      onClick: () => navigate("/settings") 
    },
    { 
      icon: "Bookmark", 
      label: "Saved Posts", 
      onClick: () => navigate("/saved") 
    },
    { 
      icon: "HelpCircle", 
      label: "Help", 
      onClick: () => navigate("/help") 
    }
  ];

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="flex items-center space-x-2 px-2"
      >
        <Avatar 
          src={user?.avatar} 
          alt={user?.username} 
          size="sm"
          fallback={user?.username}
        />
        <span className="hidden md:block font-medium text-gray-700">
          {user?.username || "User"}
        </span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )} 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Avatar 
                src={user?.avatar} 
                alt={user?.username} 
                size="md"
                fallback={user?.username}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.postKarma || 0} karma
                </p>
              </div>
            </div>
          </div>
          
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name={item.icon} className="h-4 w-4 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;