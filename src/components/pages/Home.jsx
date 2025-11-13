import React from "react";
import PostFeed from "@/components/organisms/PostFeed";
import CommunitySidebar from "@/components/organisms/CommunitySidebar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { usePosts } from "@/hooks/usePosts";
import { useCommunities } from "@/hooks/useCommunities";
import { useTopics } from "@/hooks/useTopics";

const Home = () => {
  const { 
    posts, 
    loading: postsLoading, 
    error: postsError, 
    hasMore, 
    loadMore, 
    handleVote, 
    handleSave,
    refetch: refetchPosts
  } = usePosts();

  const { 
    popularCommunities, 
    loading: communitiesLoading, 
    handleJoinCommunity 
  } = useCommunities();

  const { 
    trendingTopics, 
    loading: topicsLoading 
  } = useTopics();

  if (postsLoading && posts.length === 0) {
    return (
      <div className="flex gap-6">
        <div className="flex-1">
          <Loading />
        </div>
        <div className="w-80 hidden lg:block">
          <div className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (postsError && posts.length === 0) {
    return (
      <div className="flex gap-6">
        <div className="flex-1">
          <ErrorView
            title="Failed to load posts"
            message={postsError}
            onRetry={refetchPosts}
          />
        </div>
        <div className="w-80 hidden lg:block">
          <CommunitySidebar
            popularCommunities={popularCommunities}
            trendingTopics={trendingTopics}
            onJoinCommunity={handleJoinCommunity}
          />
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex gap-6">
        <div className="flex-1">
          <Empty
            title="Welcome to ThreadHub!"
            message="Start exploring communities and join conversations that interest you. The front page will populate with posts from your joined communities."
            actionLabel="Explore Communities"
            actionIcon="Users"
            onAction={() => window.location.href = "/communities"}
          />
        </div>
        <div className="w-80 hidden lg:block">
          <CommunitySidebar
            popularCommunities={popularCommunities}
            trendingTopics={trendingTopics}
            onJoinCommunity={handleJoinCommunity}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Main Feed */}
      <div className="flex-1 min-w-0">
        <PostFeed
          posts={posts}
          onVote={handleVote}
          onSave={handleSave}
          hasMore={hasMore}
          onLoadMore={loadMore}
          loading={postsLoading}
        />
      </div>

      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 hidden lg:block">
        <div className="sticky top-20">
          <CommunitySidebar
            popularCommunities={popularCommunities}
            trendingTopics={trendingTopics}
            onJoinCommunity={handleJoinCommunity}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;