import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import PostCard from "@/components/organisms/PostCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import postService from "@/services/api/postService";
import { toast } from "react-toastify";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const searchPosts = async () => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Mock search by filtering posts that contain the query
      const allPosts = await postService.getAll({ limit: 100 });
      const filteredPosts = allPosts.posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content?.toLowerCase().includes(query.toLowerCase()) ||
        post.community.toLowerCase().includes(query.toLowerCase()) ||
        post.author.toLowerCase().includes(query.toLowerCase())
      );
      
      // Sort results
      let sortedPosts = [...filteredPosts];
      switch (sortBy) {
        case "new":
          sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "top":
          sortedPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
          break;
        case "relevance":
        default:
          // Simple relevance: title matches score higher
          sortedPosts.sort((a, b) => {
            const aRelevance = a.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
            const bRelevance = b.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
            return bRelevance - aRelevance;
          });
      }
      
      setPosts(sortedPosts);
    } catch (err) {
      setError(err.message || "Search failed");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => {
        if (post.Id === postId) {
          const currentVote = post.userVote;
          let newUpvotes = post.upvotes;
          let newDownvotes = post.downvotes;
          let newUserVote = voteType;

          // Remove previous vote
          if (currentVote === "up") {
            newUpvotes--;
          } else if (currentVote === "down") {
            newDownvotes--;
          }

          // Apply new vote
          if (voteType === "up" && currentVote !== "up") {
            newUpvotes++;
          } else if (voteType === "down" && currentVote !== "down") {
            newDownvotes++;
          } else {
            newUserVote = null;
          }

          return {
            ...post,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          };
        }
        return post;
      }));

      await postService.vote(postId, voteType);
    } catch (err) {
      toast.error("Failed to vote on post");
      searchPosts(); // Revert changes
    }
  };

  const handleSave = async (postId) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => {
        if (post.Id === postId) {
          return { ...post, saved: !post.saved };
        }
        return post;
      }));

      await postService.toggleSave(postId);
      
      const post = posts.find(p => p.Id === postId);
      toast.success(post?.saved ? "Post saved!" : "Post unsaved!");
    } catch (err) {
      toast.error("Failed to save post");
      searchPosts(); // Revert changes
    }
  };

  useEffect(() => {
    searchPosts();
  }, [query, sortBy]);

  const sortOptions = [
    { key: "relevance", label: "Relevance", icon: "Target" },
    { key: "new", label: "New", icon: "Clock" },
    { key: "top", label: "Top", icon: "TrendingUp" }
  ];

  if (!query.trim()) {
    return (
      <div className="max-w-4xl mx-auto">
        <Empty
          title="Search ThreadHub"
          message="Enter a search term to find posts, communities, and users across ThreadHub."
          actionLabel="Explore Communities"
          actionIcon="Search"
          onAction={() => window.location.href = "/communities"}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Search results for "{query}"
        </h1>
        
        {!loading && (
          <p className="text-gray-600">
            {posts.length} {posts.length === 1 ? "result" : "results"} found
          </p>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorView
          title="Search failed"
          message={error}
          onRetry={searchPosts}
        />
      ) : posts.length === 0 ? (
        <Empty
          title="No results found"
          message={`No posts found matching "${query}". Try different keywords or browse popular communities.`}
          actionLabel="Browse Communities"
          actionIcon="Users"
          onAction={() => window.location.href = "/communities"}
        />
      ) : (
        <div className="space-y-4">
          {/* Sort Options */}
          <Card className="p-1">
            <div className="flex space-x-1">
              {sortOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={sortBy === option.key ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(option.key)}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <ApperIcon name={option.icon} className="h-4 w-4" />
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.Id}
                post={post}
                onVote={handleVote}
                onSave={handleSave}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;