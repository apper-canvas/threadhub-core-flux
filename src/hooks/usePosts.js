import { useState, useEffect } from "react";
import postService from "@/services/api/postService";
import { toast } from "react-toastify";

export const usePosts = (filters = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = async (resetPage = false) => {
    try {
      setLoading(true);
      setError("");
      
      const currentPage = resetPage ? 1 : page;
const response = await postService.getAll({
        ...filters,
        page: currentPage,
        limit: 10
      });
      
      if (resetPage) {
        setPosts(response.posts);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err.message || "Failed to fetch posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => {
if ((post.Id === postId) || (post.id === postId)) {
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
      // Revert optimistic update
      fetchPosts(true);
    }
  };

  const handleSave = async (postId) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(post => {
if ((post.Id === postId) || (post.id === postId)) {
          return { ...post, saved: !post.saved };
        }
        return post;
      }));

      await postService.toggleSave(postId);
      
const post = posts.find(p => (p.Id === postId) || (p.id === postId));
      toast.success(post?.saved ? "Post saved!" : "Post unsaved!");
    } catch (err) {
      toast.error("Failed to save post");
      // Revert optimistic update
      fetchPosts(true);
    }
  };

  useEffect(() => {
fetchPosts(true);
  }, [filters.sortBy, filters.community]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    handleVote,
    handleSave,
    refetch: () => fetchPosts(true)
  };
};