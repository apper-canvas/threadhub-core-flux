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
        toast.success("Left community");
      } else {
        await communityService.join(communityId);
        toast.success("Joined community!");
      }
      
      // Update state
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