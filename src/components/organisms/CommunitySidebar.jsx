import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatNumber } from "@/utils/formatNumber";

const CommunitySidebar = ({ 
  popularCommunities = [], 
  trendingTopics = [],
  onJoinCommunity 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Popular Communities */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Popular Communities</h2>
        </div>
        
        <div className="space-y-3">
          {popularCommunities.map((community) => (
            <div key={community.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                {community.icon ? (
                  <img 
                    src={community.icon} 
                    alt={community.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <ApperIcon name="Hash" className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`/r/${community.name}`)}
                  className="text-sm font-medium text-gray-900 hover:text-primary transition-colors block truncate"
                >
                  r/{community.displayName}
                </button>
                <p className="text-xs text-gray-500">
                  {formatNumber(community.memberCount)} members
                </p>
              </div>
              
              <Button
                variant={community.isJoined ? "secondary" : "primary"}
                size="sm"
                onClick={() => onJoinCommunity?.(community.id)}
                className="flex-shrink-0"
              >
                {community.isJoined ? "Joined" : "Join"}
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/communities")}
          className="w-full mt-4 text-primary hover:text-accent"
        >
          View All Communities
        </Button>
      </Card>

      {/* Trending Topics */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Hash" className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-semibold text-gray-900">Trending Topics</h2>
        </div>
        
        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => navigate(`/search?q=${encodeURIComponent(topic.name)}`)}
              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-2">
                <span className="text-secondary font-medium">#{topic.name}</span>
              </div>
              <Badge variant="default" size="sm">
                {formatNumber(topic.postCount)}
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Create Community CTA */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="text-center">
          <ApperIcon name="Users" className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Create a Community</h3>
          <p className="text-sm text-gray-600 mb-4">
            Build a home for your interests and connect with others who share your passions.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/communities/create")}
            className="w-full"
          >
            Create Community
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CommunitySidebar;