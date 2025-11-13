import { useState, useEffect } from "react";
import communityService from "@/services/api/communityService";
import { toast } from "react-toastify";

export const useCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPopularCommunities = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await communityService.getPopular(10);
      setPopularCommunities(response);
    } catch (err) {
      setError(err.message || "Failed to fetch communities");
      console.error("Error fetching communities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      // Find current join status
      const community = popularCommunities.find(c => c.Id === communityId);
      
      if (community?.isJoined) {
        await communityService.leave(communityId);
        toast.success("Left community successfully");
      } else {
        await communityService.join(communityId);
        toast.success("Joined community! Welcome aboard!");
      }
      
      // Update state with enhanced feedback
      setPopularCommunities(prev => prev.map(c => {
        if (c.Id === communityId) {
          return {
            ...c,
            isJoined: !c.isJoined,
            memberCount: c.isJoined ? c.memberCount - 1 : c.memberCount + 1
          };
        }
        return c;
      }));
      
    } catch (err) {
      toast.error("Failed to update community membership");
      console.error("Error joining/leaving community:", err);
    }
  };

  useEffect(() => {
    fetchPopularCommunities();
  }, []);

  return {
    communities,
    popularCommunities,
    loading,
    error,
    handleJoinCommunity,
    refetch: fetchPopularCommunities
  };
};

// New hook for individual community branding and theming
export const useCommunity = (communityName) => {
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const fetchCommunity = async () => {
    if (!communityName) return;
    
    try {
      setLoading(true);
      setError("");
      
      const response = await communityService.getByName(communityName);
      setCommunity(response);
    } catch (err) {
      setError(err.message || "Community not found");
      console.error("Error fetching community:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!community || joinLoading) return;
    
    try {
      setJoinLoading(true);
      
      if (community.isJoined) {
        await communityService.leave(community.Id);
        toast.success(`Left r/${community.displayName}`);
        setCommunity(prev => ({
          ...prev,
          isJoined: false,
          memberCount: prev.memberCount - 1
        }));
      } else {
        await communityService.join(community.Id);
        toast.success(`Welcome to r/${community.displayName}! 🎉`);
        setCommunity(prev => ({
          ...prev,
          isJoined: true,
          memberCount: prev.memberCount + 1
        }));
      }
    } catch (err) {
      toast.error("Failed to update community membership");
      console.error("Error joining/leaving community:", err);
    } finally {
      setJoinLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [communityName]);

  return {
    community,
    loading,
    error,
    handleJoinLeave,
    joinLoading,
    refetch: fetchCommunity
  };
};

// Hook for managing community theme application
export const useCommunityTheme = (community) => {
  const [themeApplied, setThemeApplied] = useState(false);

  const applyTheme = (themeColors) => {
    if (!themeColors) return;

    // Apply CSS custom properties for community theming
    const root = document.documentElement;
    root.style.setProperty('--community-primary', themeColors.primaryColor);
    root.style.setProperty('--community-secondary', themeColors.secondaryColor);
    root.style.setProperty('--community-accent', themeColors.accentColor);
    root.style.setProperty('--community-bg', themeColors.backgroundColor);
    root.style.setProperty('--community-text', themeColors.textColor);
    
    setThemeApplied(true);
  };

  const resetTheme = () => {
    const root = document.documentElement;
    root.style.removeProperty('--community-primary');
    root.style.removeProperty('--community-secondary');
    root.style.removeProperty('--community-accent');
    root.style.removeProperty('--community-bg');
    root.style.removeProperty('--community-text');
    
    setThemeApplied(false);
  };

  useEffect(() => {
    if (community?.theme) {
      applyTheme(community.theme);
    }

    // Cleanup theme on unmount
    return () => resetTheme();
  }, [community]);

  return {
    themeApplied,
    applyTheme,
    resetTheme
  };
};