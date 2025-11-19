import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PostFeed from "@/components/organisms/PostFeed";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import communityService from "@/services/api/communityService";
import { usePosts } from "@/hooks/usePosts";
import { formatNumber } from "@/utils/formatNumber";
import { formatTimeAgo } from "@/utils/formatTime";
import { toast } from "react-toastify";

const Community = () => {
  const { communityName } = useParams();
  const [community, setCommunity] = useState(null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState("");

  const { 
    posts, 
    loading: postsLoading, 
    error: postsError, 
    hasMore, 
    loadMore, 
    handleVote, 
    handleSave,
    refetch: refetchPosts
  } = usePosts({ community: communityName });

  const fetchCommunity = async () => {
    try {
      setCommunityLoading(true);
      setCommunityError("");
      
      const response = await communityService.getByName(communityName);
      setCommunity(response);
    } catch (err) {
      setCommunityError(err.message || "Community not found");
      console.error("Error fetching community:", err);
    } finally {
      setCommunityLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!community) return;
    
    try {
      if (community.isJoined) {
        await communityService.leave(community.Id);
        toast.success("Left community");
      } else {
        await communityService.join(community.Id);
        toast.success("Joined community!");
      }
      
      setCommunity(prev => ({
        ...prev,
        isJoined: !prev.isJoined,
        memberCount: prev.isJoined ? prev.memberCount - 1 : prev.memberCount + 1
      }));
    } catch (err) {
      toast.error("Failed to update community membership");
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [communityName]);

  if (communityLoading) {
    return <Loading />;
  }

  if (communityError) {
    return (
      <ErrorView
        title="Community not found"
        message={communityError}
        onRetry={fetchCommunity}
      />
    );
  }

  if (!community) {
    return (
      <ErrorView
        title="Community not found"
        message="This community may not exist or has been removed."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Community Header */}
      <Card className="mb-6 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Community Info */}
        <div className="p-6 -mt-16 relative">
          <div className="flex items-start space-x-4">
            {/* Community Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg">
              {community.icon ? (
                <img 
                  src={community.icon} 
                  alt={community.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <ApperIcon name="Hash" className="h-8 w-8 text-white" />
              )}
            </div>
            
            {/* Details */}
            <div className="flex-1 mt-4">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  r/{community.displayName}
                </h1>
                <Badge variant="default">
                  {formatNumber(community.memberCount)} members
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4 max-w-2xl">
                {community.description}
              </p>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant={community.isJoined ? "secondary" : "primary"}
                  onClick={handleJoinLeave}
                  className="px-6"
                >
                  <ApperIcon 
                    name={community.isJoined ? "UserMinus" : "UserPlus"} 
                    className="h-4 w-4 mr-2" 
                  />
                  {community.isJoined ? "Leave" : "Join"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/submit"}
                >
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                
                <div className="text-sm text-gray-500">
                  Created {formatTimeAgo(community.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      <div className="flex gap-6">
        {/* Posts */}
        <div className="flex-1">
          {postsLoading && posts.length === 0 ? (
            <Loading />
          ) : postsError && posts.length === 0 ? (
            <ErrorView
              title="Failed to load posts"
              message={postsError}
              onRetry={refetchPosts}
            />
          ) : posts.length === 0 ? (
            <Empty
              title={`No posts in r/${community.displayName} yet`}
              message="Be the first to start a discussion in this community!"
              actionLabel="Create Post"
              actionIcon="Plus"
            />
          ) : (
            <PostFeed
              posts={posts}
              onVote={handleVote}
              onSave={handleSave}
              hasMore={hasMore}
              onLoadMore={loadMore}
              loading={postsLoading}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="sticky top-20">
            <Card className="p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">About Community</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {community.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Members</span>
                  <span className="font-medium">{formatNumber(community.memberCount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">{formatTimeAgo(community.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Rules placeholder */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Community Rules</h3>
              <div className="text-sm text-gray-500 text-center py-4">
                <ApperIcon name="BookOpen" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Community rules will be displayed here when available.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;