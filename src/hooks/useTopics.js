import { useState, useEffect } from "react";
import topicService from "@/services/api/topicService";

export const useTopics = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrendingTopics = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await topicService.getTrending(10);
      setTrendingTopics(response);
    } catch (err) {
      setError(err.message || "Failed to fetch trending topics");
      console.error("Error fetching trending topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  return {
    trendingTopics,
    loading,
    error,
    refetch: fetchTrendingTopics
  };
};