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

// Apply community-specific CSS custom properties for dynamic theming
  const communityStyle = {
    '--community-primary': community.theme?.primaryColor || '#FF4500',
    '--community-secondary': community.theme?.secondaryColor || '#0079D3',
    '--community-accent': community.theme?.accentColor || '#FF8717',
    '--community-bg': community.theme?.backgroundColor || 'rgba(255, 69, 0, 0.05)',
    '--community-text': community.theme?.textColor || '#1a202c'
  };

  return (
    <div className="max-w-6xl mx-auto" style={communityStyle}>
      {/* Enhanced Community Header with Dynamic Branding */}
      <Card className="mb-6 overflow-hidden shadow-xl border-0">
        {/* Dynamic Banner with Gradient Overlays */}
        <div className="h-56 relative overflow-hidden">
          {community.bannerImage ? (
            <>
              <img 
                src={community.bannerImage} 
                alt={`${community.displayName} banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </>
          ) : (
            <div 
              className="w-full h-full relative"
              style={{
                background: `linear-gradient(135deg, ${community.theme?.primaryColor || '#FF4500'}20 0%, ${community.theme?.secondaryColor || '#0079D3'}15 50%, ${community.theme?.accentColor || '#FF8717'}20 100%)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          
          {/* Community Category Badge */}
          <div className="absolute top-4 right-4">
            <Badge 
              variant="secondary" 
              className="bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg"
            >
              {community.category || 'General'}
            </Badge>
          </div>
        </div>
        
        {/* Enhanced Community Profile Section */}
        <div className="p-8 -mt-20 relative">
          <div className="flex items-start space-x-6">
            {/* Large Community Avatar with Custom Styling */}
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border-4 border-white shadow-2xl relative overflow-hidden"
              style={{
                background: community.theme?.primaryColor 
                  ? `linear-gradient(135deg, ${community.theme.primaryColor} 0%, ${community.theme.accentColor || community.theme.primaryColor} 100%)`
                  : 'linear-gradient(135deg, #FF4500 0%, #FF8717 100%)'
              }}
            >
              {community.icon ? (
                <img 
                  src={community.icon} 
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ApperIcon name="Hash" className="h-10 w-10 text-white" />
              )}
              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Enhanced Community Details */}
            <div className="flex-1 mt-6 space-y-4">
              {/* Header with Custom Color Accent */}
              <div className="space-y-3">
                <div className="flex items-center space-x-4 flex-wrap">
                  <h1 
                    className="text-4xl font-bold"
                    style={{ color: community.theme?.textColor || '#1a202c' }}
                  >
                    r/{community.displayName}
                  </h1>
                  <Badge 
                    variant="outline" 
                    className="text-base px-4 py-1"
                    style={{ 
                      borderColor: community.theme?.primaryColor || '#FF4500',
                      color: community.theme?.primaryColor || '#FF4500'
                    }}
                  >
                    {formatNumber(community.memberCount)} members
                  </Badge>
                </div>
                
                {/* Community Stats Row */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span className="flex items-center space-x-2">
                    <ApperIcon name="Users" className="h-4 w-4" />
                    <span className="font-medium">{formatNumber(community.memberCount)} members</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <ApperIcon name="Circle" className="h-3 w-3 text-green-500 fill-current" />
                    <span className="font-medium">{formatNumber(Math.floor(community.memberCount * 0.05))} online</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <ApperIcon name="TrendingUp" className="h-4 w-4" />
                    <span className="font-medium">#{community.rank || Math.floor(Math.random() * 100) + 1} trending</span>
                  </span>
                </div>
              </div>
              
              {/* Enhanced Description */}
              <div className="max-w-4xl">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {community.description}
                </p>
                {community.longDescription && (
                  <p className="text-gray-600 mt-2 text-sm">
                    {community.longDescription}
                  </p>
                )}
              </div>
              
              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  variant={community.isJoined ? "outline" : "default"}
                  onClick={handleJoinLeave}
                  className="px-8 py-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  style={{
                    backgroundColor: !community.isJoined ? (community.theme?.primaryColor || '#FF4500') : 'transparent',
                    borderColor: community.theme?.primaryColor || '#FF4500',
                    color: community.isJoined ? (community.theme?.primaryColor || '#FF4500') : 'white'
                  }}
                >
                  <ApperIcon 
                    name={community.isJoined ? "UserMinus" : "UserPlus"} 
                    className="h-5 w-5 mr-2" 
                  />
                  {community.isJoined ? "Leave Community" : "Join Community"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate("/submit")}
                  className="px-6 py-2 font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
                  Create Post
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="px-4 py-2 text-sm"
                >
                  <ApperIcon name="Bell" className="h-4 w-4 mr-1" />
                  Notifications
                </Button>
                
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                  Created {formatTimeAgo(community.createdAt)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Content Layout */}
      <div className="flex gap-8">
        {/* Main Content with Community Branding */}
        <div className="flex-1 space-y-6">
          {/* Enhanced Sort and Filter Controls */}
          <Card className="p-6 shadow-md border-l-4" style={{ borderLeftColor: community.theme?.primaryColor || '#FF4500' }}>
            <div className="space-y-6">
              {/* Sort Options with Enhanced Styling */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <ApperIcon name="ArrowUpDown" className="h-5 w-5" style={{ color: community.theme?.primaryColor || '#FF4500' }} />
                  <span>Sort Posts</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant={sortBy === option.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSortChange(option.key)}
                      className="flex items-center space-x-2 px-4 py-2 transition-all duration-200 hover:scale-105"
                      style={sortBy === option.key ? {
                        backgroundColor: community.theme?.primaryColor || '#FF4500',
                        borderColor: community.theme?.primaryColor || '#FF4500',
                        color: 'white'
                      } : {
                        borderColor: community.theme?.primaryColor || '#FF4500',
                        color: community.theme?.primaryColor || '#FF4500'
                      }}
                    >
                      <ApperIcon name={option.icon} className="h-4 w-4" />
                      <span className="font-medium">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Post Type Filter with Enhanced Styling */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <ApperIcon name="Filter" className="h-5 w-5" style={{ color: community.theme?.secondaryColor || '#0079D3' }} />
                  <span>Content Type</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {postTypeOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant={postType === option.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePostTypeChange(option.key)}
                      className="flex items-center space-x-2 px-4 py-2 transition-all duration-200 hover:scale-105"
                      style={postType === option.key ? {
                        backgroundColor: community.theme?.secondaryColor || '#0079D3',
                        borderColor: community.theme?.secondaryColor || '#0079D3',
                        color: 'white'
                      } : {
                        borderColor: community.theme?.secondaryColor || '#0079D3',
                        color: community.theme?.secondaryColor || '#0079D3'
                      }}
                    >
                      <ApperIcon name={option.icon} className="h-4 w-4" />
                      <span className="font-medium">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Feed with Enhanced States */}
          {postsLoading && posts.length === 0 ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ) : postsError && posts.length === 0 ? (
            <Card className="p-8 text-center">
              <ErrorView
                title="Failed to load posts"
                message={postsError}
                onRetry={refetchPosts}
              />
            </Card>
          ) : posts.length === 0 ? (
            <Card className="p-12 text-center" style={{ backgroundColor: community.theme?.backgroundColor || 'rgba(255, 69, 0, 0.02)' }}>
              <Empty
                title={`Welcome to r/${community.displayName}!`}
                message="This community is just getting started. Be the first to share something interesting!"
                actionLabel="Create the First Post"
                actionIcon="Plus"
                onAction={() => navigate("/submit")}
              />
            </Card>
          ) : (
            <div className="space-y-1">
              <PostFeed
                posts={posts}
                onVote={handleVote}
                onSave={handleSave}
                hasMore={hasMore}
                onLoadMore={loadMore}
                loading={postsLoading}
                hideControls={true}
                communityTheme={community.theme}
              />
            </div>
          )}
        </div>

        {/* Enhanced Branded Sidebar */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {/* About Community with Enhanced Design */}
            <Card className="p-6 shadow-lg border-l-4" style={{ borderLeftColor: community.theme?.primaryColor || '#FF4500' }}>
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: community.theme?.primaryColor || '#FF4500' }}
                >
                  <ApperIcon name="Info" className="h-4 w-4 text-white" />
                </div>
                <span>About r/{community.displayName}</span>
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {community.description}
              </p>
              
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <ApperIcon name="Users" className="h-4 w-4" />
                    <span className="font-medium">Members</span>
                  </span>
                  <span className="font-bold text-lg" style={{ color: community.theme?.primaryColor || '#FF4500' }}>
                    {formatNumber(community.memberCount)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <ApperIcon name="Circle" className="h-3 w-3 text-green-500 fill-current" />
                    <span className="font-medium">Online Now</span>
                  </span>
                  <span className="font-bold text-lg text-green-600">
                    {formatNumber(Math.floor(community.memberCount * 0.05))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    <span className="font-medium">Created</span>
                  </span>
                  <span className="font-bold">{formatTimeAgo(community.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Enhanced Community Rules */}
            <Card className="p-6 shadow-lg border-l-4" style={{ borderLeftColor: community.theme?.secondaryColor || '#0079D3' }}>
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: community.theme?.secondaryColor || '#0079D3' }}
                >
                  <ApperIcon name="BookOpen" className="h-4 w-4 text-white" />
                </div>
                <span>Community Guidelines</span>
              </h3>
              {community.rules && community.rules.length > 0 ? (
                <div className="space-y-4">
                  {community.rules.map((rule, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-3" style={{ borderLeftColor: community.theme?.secondaryColor || '#0079D3' }}>
                      <div className="flex items-start space-x-3">
                        <Badge 
                          variant="outline" 
                          size="sm" 
                          className="mt-1 flex-shrink-0 font-bold"
                          style={{ 
                            borderColor: community.theme?.secondaryColor || '#0079D3',
                            color: community.theme?.secondaryColor || '#0079D3'
                          }}
                        >
                          {index + 1}
                        </Badge>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 mb-1">{rule.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{rule.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="BookOpen" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No community guidelines yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Check back later for updates!</p>
                </div>
              )}
            </Card>

            {/* Enhanced Moderators Section */}
            <Card className="p-6 shadow-lg border-l-4" style={{ borderLeftColor: community.theme?.accentColor || '#FF8717' }}>
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: community.theme?.accentColor || '#FF8717' }}
                >
                  <ApperIcon name="Shield" className="h-4 w-4 text-white" />
                </div>
                <span>Community Team</span>
              </h3>
              {community.moderators && community.moderators.length > 0 ? (
                <div className="space-y-3">
                  {community.moderators.map((mod) => (
                    <div key={mod.username} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar 
                        src={mod.avatar} 
                        alt={mod.username}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => navigate(`/u/${mod.username}`)}
                          className="text-sm font-semibold text-gray-900 hover:underline transition-colors truncate block"
                          style={{ color: community.theme?.accentColor || '#FF8717' }}
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
                <div className="text-center py-8">
                  <ApperIcon name="Shield" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">Community team info coming soon.</p>
                </div>
              )}
            </Card>

            {/* Enhanced Related Communities */}
            <Card className="p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center bg-gradient-to-r"
                  style={{ 
                    background: `linear-gradient(45deg, ${community.theme?.primaryColor || '#FF4500'}, ${community.theme?.accentColor || '#FF8717'})` 
                  }}
                >
                  <ApperIcon name="Link2" className="h-4 w-4 text-white" />
                </div>
                <span>Similar Communities</span>
              </h3>
              {community.relatedCommunities && community.relatedCommunities.length > 0 ? (
                <div className="space-y-3">
                  {community.relatedCommunities.map((related) => (
                    <button
                      key={related.name}
                      onClick={() => navigate(`/r/${related.name}`)}
                      className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md text-left group"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ 
                          background: `linear-gradient(135deg, ${community.theme?.primaryColor || '#FF4500'}, ${community.theme?.accentColor || '#FF8717'})` 
                        }}
                      >
                        <ApperIcon name="Hash" className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                          r/{related.displayName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatNumber(related.memberCount)} members
                        </p>
                      </div>
                      <ApperIcon name="ExternalLink" className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Link2" className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">Discover similar communities soon.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;