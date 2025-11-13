import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatNumber } from "@/utils/formatNumber";
import { formatTimeAgo } from "@/utils/formatTime";
import postService from "@/services/api/postService";
import ApperIcon from "@/components/ApperIcon";
import CommunityPill from "@/components/molecules/CommunityPill";
import VoteControls from "@/components/molecules/VoteControls";
import MediaThumbnail from "@/components/molecules/MediaThumbnail";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
export default function PostDetail() {
  const { id: postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Validate postId before making API call
      if (!postId || postId === '' || (typeof postId !== 'number' && !/^\d+$/.test(String(postId)))) {
        throw new Error('Invalid post ID in URL. Please check the link and try again.')
      }
      
      // Get post data
      const response = await postService.getById(postId)
      setPost(response)
    } catch (err) {
      console.error('Error fetching post:', err)
      setError(err.message || 'Failed to load post')
    } finally {
setLoading(false)
    }
  };
  const handleVote = async (_, voteType) => {
    if (!post) return;
    
    try {
      // Optimistic update
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

      setPost(prev => ({
        ...prev,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        userVote: newUserVote
      }));

      await postService.vote(postId, voteType);
    } catch (err) {
      toast.error("Failed to vote on post");
      fetchPost(); // Revert changes
    }
  };

  const handleSave = async () => {
    if (!post) return;
    
    try {
      setPost(prev => ({ ...prev, saved: !prev.saved }));
      await postService.toggleSave(postId);
      toast.success(post.saved ? "Post unsaved!" : "Post saved!");
    } catch (err) {
      toast.error("Failed to save post");
      fetchPost(); // Revert changes
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) {
    return <Loading count={1} />;
  }

  if (error) {
    return (
      <ErrorView
        title="Post not found"
        message={error}
        onRetry={fetchPost}
      />
    );
  }

  if (!post) {
    return (
      <ErrorView
        title="Post not found"
        message="This post may have been deleted or doesn't exist."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Post Content */}
      <Card className="p-6 mb-6">
        <div className="flex space-x-4">
          {/* Vote Controls */}
          <div className="flex-shrink-0">
            <VoteControls
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              userVote={post.userVote}
              onVote={handleVote}
              size="lg"
              orientation="vertical"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <CommunityPill 
                community={{ 
                  name: post.community, 
                  displayName: post.community 
                }}
                size="md"
              />
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-2">
                <Avatar 
                  src={null} 
                  alt={post.author} 
                  size="sm"
                  fallback={post.author}
                />
                <button 
                  className="text-sm font-medium text-gray-700 hover:text-primary hover:underline"
                  onClick={() => navigate(`/user/${post.author}`)}
                >
                  u/{post.author}
                </button>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Media */}
            {post.mediaUrl && (
              <div className="mb-6">
                {post.contentType === "image" ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                ) : post.contentType === "video" ? (
                  <video
                    src={post.mediaUrl}
                    controls
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                ) : null}
              </div>
            )}

            {/* Content */}
            {post.content && post.contentType === "text" && (
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            )}

            {/* Link Preview */}
            {post.contentType === "link" && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="ExternalLink" className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new URL(post.content).hostname}
                  </span>
                </div>
                <a
                  href={post.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent font-medium"
                >
                  Visit Link
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500">
                <ApperIcon name="MessageSquare" className="h-5 w-5" />
                <span className="font-medium">
                  {formatNumber(post.commentCount)} comments
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="Share" className="h-4 w-4 mr-2" />
                <span>Share</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className={post.saved ? "text-primary" : "text-gray-500 hover:text-gray-700"}
              >
                <ApperIcon 
                  name={post.saved ? "Bookmark" : "BookmarkPlus"} 
                  className="h-4 w-4 mr-2" 
                />
                <span>{post.saved ? "Saved" : "Save"}</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Comments Section */}
      <Card className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="MessageSquare" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Comments Coming Soon</h3>
          <p className="text-gray-500">
            The comment system is currently being built. Check back soon to join the discussion!
          </p>
        </div>
      </Card>
    </div>
  );
};