import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import postService from "@/services/api/postService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const Submit = () => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState("text");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    community: "general",
    mediaUrl: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const postTypes = [
    { key: "text", label: "Text", icon: "FileText", description: "Share your thoughts and ideas" },
    { key: "link", label: "Link", icon: "ExternalLink", description: "Share an interesting link" },
    { key: "image", label: "Image", icon: "Image", description: "Share a photo or image" },
    { key: "video", label: "Video", icon: "Video", description: "Share a video" }
  ];

  const popularCommunities = [
    "general", "webdev", "science", "gaming", "food", "cats", "dogs", 
    "photography", "technology", "books", "movies", "music"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (postType === "text" && !formData.content.trim()) {
      toast.error("Content is required for text posts");
      return;
    }

    if ((postType === "link" || postType === "image" || postType === "video") && !formData.content.trim()) {
      toast.error("URL is required");
      return;
    }

    try {
      setSubmitting(true);
      
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        contentType: postType,
        mediaUrl: (postType === "image" || postType === "video") ? formData.content.trim() : null,
        thumbnailUrl: (postType === "image" || postType === "video") ? formData.content.trim() : null,
        author: "threaduser", // Mock user
        authorId: "u_current",
        community: formData.community,
        communityId: "c_" + formData.community
      };

      const newPost = await postService.create(postData);
      toast.success("Post created successfully!");
      navigate(`/r/${newPost.community}/comments/${newPost.Id}`);
    } catch (err) {
      toast.error("Failed to create post");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create a post</h1>
        <p className="text-gray-600">
          Share something interesting with the ThreadHub community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post Type Selection */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose post type</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {postTypes.map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setPostType(type.key)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-all",
                  postType === type.key 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                )}
              >
                <ApperIcon name={type.icon} className="h-6 w-6 mb-2" />
                <div className="font-medium mb-1">{type.label}</div>
                <div className="text-xs opacity-75">{type.description}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Community Selection */}
        <Card className="p-4">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Choose a community
          </label>
          <div className="flex flex-wrap gap-2">
            {popularCommunities.map((community) => (
              <button
                key={community}
                type="button"
                onClick={() => handleInputChange("community", community)}
                className={cn(
                  "transition-all",
                  formData.community === community && "scale-105"
                )}
              >
                <Badge 
                  variant={formData.community === community ? "primary" : "default"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  r/{community}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        {/* Post Content */}
        <Card className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="An interesting title for your post"
              maxLength="300"
              className="text-lg"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.title.length}/300 characters
            </div>
          </div>

          {/* Content based on post type */}
          <div>
            {postType === "text" ? (
              <>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Text *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="What would you like to share?"
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {postType === "link" ? "URL" : `${postType.charAt(0).toUpperCase() + postType.slice(1)} URL`} *
                </label>
                <Input
                  type="url"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder={
                    postType === "link" 
                      ? "https://example.com" 
                      : `https://example.com/image.${postType === "image" ? "jpg" : "mp4"}`
                  }
                />
              </>
            )}
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="px-8"
          >
            {submitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ApperIcon name="Send" className="h-4 w-4" />
                <span>Create Post</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Submit;