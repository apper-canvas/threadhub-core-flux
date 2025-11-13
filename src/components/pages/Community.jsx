import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { toast } from "react-toastify";
import { formatNumber } from "@/utils/formatNumber";
import { formatTimeAgo } from "@/utils/formatTime";
import communityService from "@/services/api/communityService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import PostFeed from "@/components/organisms/PostFeed";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const Community = () => {
  const { communityName } = useParams();
const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState("");
  const [sortBy, setSortBy] = useState("hot");
  const [postType, setPostType] = useState("all");

const { 
    posts, 
    loading: postsLoading, 
    error: postsError, 
    hasMore, 
    loadMore, 
    handleVote, 
    handleSave,
    refetch: refetchPosts
  } = usePosts({ community: communityName, sortBy, postType });

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

  const sortOptions = [
    { key: "hot", label: "Hot", icon: "Flame" },
    { key: "new", label: "New", icon: "Clock" },
    { key: "top", label: "Top All Time", icon: "TrendingUp" },
    { key: "topWeek", label: "Top This Week", icon: "Calendar" },
    { key: "controversial", label: "Controversial", icon: "MessageSquare" }
  ];

  const postTypeOptions = [
    { key: "all", label: "All", icon: "Grid3x3" },
    { key: "image", label: "Images", icon: "Image" },
    { key: "video", label: "Videos", icon: "Video" },
    { key: "discussion", label: "Discussions", icon: "MessageSquare" },
    { key: "link", label: "Links", icon: "Link" }
  ];

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handlePostTypeChange = (newType) => {
    setPostType(newType);
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
{/* Community Banner */}
        <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20 relative overflow-hidden">
          {community.bannerImage ? (
            <img 
              src={community.bannerImage} 
              alt={`${community.displayName} banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
<div className="flex items-center space-x-3 mb-2">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                    {community.icon ? (
                      <img 
                        src={community.icon} 
                        alt={community.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <ApperIcon name="Hash" className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      r/{community.displayName}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Users" className="h-4 w-4" />
                        <span>{formatNumber(community.memberCount)} members</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Circle" className="h-3 w-3 text-green-500 fill-current" />
                        <span>{formatNumber(Math.floor(community.memberCount * 0.05))} online</span>
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="default">
                  {formatNumber(community.memberCount)} members
                </Badge>
              </div>
              
<p className="text-gray-600 mb-6 max-w-3xl leading-relaxed">
                {community.description}
              </p>
              
<div className="flex flex-wrap items-center gap-4">
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
                  onClick={() => navigate("/submit")}
                >
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                
                <Badge variant="secondary" className="px-3 py-1">
                  Created {formatTimeAgo(community.createdAt)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      <div className="flex gap-6">
        {/* Posts */}
{/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Sort and Filter Controls */}
          <Card className="p-4">
            <div className="space-y-4">
              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sort by</h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant={sortBy === option.key ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handleSortChange(option.key)}
                      className="flex items-center space-x-2"
                    >
                      <ApperIcon name={option.icon} className="h-4 w-4" />
                      <span>{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Post Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Post Type</h3>
                <div className="flex flex-wrap gap-2">
                  {postTypeOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant={postType === option.key ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handlePostTypeChange(option.key)}
                      className="flex items-center space-x-2"
                    >
                      <ApperIcon name={option.icon} className="h-4 w-4" />
                      <span>{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Feed */}
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
              onAction={() => navigate("/submit")}
            />
          ) : (
            <PostFeed
              posts={posts}
              onVote={handleVote}
              onSave={handleSave}
              hasMore={hasMore}
              onLoadMore={loadMore}
              loading={postsLoading}
              hideControls={true}
            />
          )}
/>
          )}
        </div>

        {/* Enhanced Sidebar */
{/* Enhanced Sidebar */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="sticky top-20 space-y-4">
            {/* About Community */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <ApperIcon name="Info" className="h-5 w-5 text-primary" />
                <span>About Community</span>
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {community.description}
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center space-x-1">
                    <ApperIcon name="Users" className="h-4 w-4" />
                    <span>Members</span>
                  </span>
                  <span className="font-medium">{formatNumber(community.memberCount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center space-x-1">
                    <ApperIcon name="Circle" className="h-3 w-3 text-green-500 fill-current" />
                    <span>Online</span>
                  </span>
                  <span className="font-medium">{formatNumber(Math.floor(community.memberCount * 0.05))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center space-x-1">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    <span>Created</span>
                  </span>
                  <span className="font-medium">{formatTimeAgo(community.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Community Rules */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-secondary" />
                <span>Community Rules</span>
              </h3>
              {community.rules && community.rules.length > 0 ? (
                <div className="space-y-3">
                  {community.rules.map((rule, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Badge variant="outline" size="sm" className="mt-0.5 flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm text-gray-900">{rule.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{rule.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  <ApperIcon name="BookOpen" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No community rules yet.</p>
                </div>
              )}
            </Card>

            {/* Moderators */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <ApperIcon name="Shield" className="h-5 w-5 text-primary" />
                <span>Moderators</span>
              </h3>
              {community.moderators && community.moderators.length > 0 ? (
                <div className="space-y-2">
                  {community.moderators.map((mod) => (
                    <div key={mod.username} className="flex items-center space-x-3">
                      <Avatar 
                        src={mod.avatar} 
                        alt={mod.username}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => navigate(`/u/${mod.username}`)}
                          className="text-sm font-medium text-gray-900 hover:text-primary transition-colors truncate block"
                        >
                          u/{mod.username}
                        </button>
                        {mod.role && (
                          <Badge variant="secondary" size="sm" className="mt-1">
                            {mod.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  <ApperIcon name="Shield" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No moderators listed.</p>
                </div>
              )}
            </Card>

            {/* Related Communities */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <ApperIcon name="Link2" className="h-5 w-5 text-accent" />
                <span>Related Communities</span>
              </h3>
              {community.relatedCommunities && community.relatedCommunities.length > 0 ? (
                <div className="space-y-2">
                  {community.relatedCommunities.map((related) => (
                    <button
                      key={related.name}
                      onClick={() => navigate(`/r/${related.name}`)}
                      className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Hash" className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          r/{related.displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatNumber(related.memberCount)} members
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  <ApperIcon name="Link2" className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No related communities.</p>
                </div>
              )}
            </Card>
</div>
        </div>
      </div>
    </div>
  );
};
};

export default Community;