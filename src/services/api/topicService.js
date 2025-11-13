import mockTopics from "@/services/mockData/trendingTopics.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TopicService {
  constructor() {
    this.topics = [...mockTopics];
  }

  async getTrending(limit = 10) {
    await delay(250);
    const sorted = [...this.topics]
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);
    
    return sorted.map(topic => ({ ...topic }));
  }

  async getAll() {
    await delay(300);
    return this.topics.map(topic => ({ ...topic }));
  }

  async search(query) {
    await delay(200);
    const filtered = this.topics.filter(topic =>
      topic.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.map(topic => ({ ...topic }));
  }
}

export default new TopicService();