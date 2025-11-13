import mockCommunities from "@/services/mockData/communities.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommunityService {
  constructor() {
    this.communities = [...mockCommunities];
  }

  async getAll() {
    await delay(300);
    return this.communities.map(community => ({ ...community }));
  }

  async getPopular(limit = 10) {
    await delay(200);
    const sorted = [...this.communities]
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, limit);
    
    return sorted.map(community => ({ ...community }));
  }

  async getById(id) {
    await delay(250);
    const community = this.communities.find(c => c.Id === parseInt(id));
    if (!community) throw new Error("Community not found");
    return { ...community };
  }

  async getByName(name) {
    await delay(250);
    const community = this.communities.find(c => 
      c.name.toLowerCase() === name.toLowerCase()
    );
    if (!community) throw new Error("Community not found");
    return { ...community };
  }

  async join(id) {
    await delay(200);
    const communityIndex = this.communities.findIndex(c => c.Id === parseInt(id));
    if (communityIndex === -1) throw new Error("Community not found");
    
    const community = this.communities[communityIndex];
    if (!community.isJoined) {
      community.memberCount++;
      community.isJoined = true;
    }
    
    return { ...community };
  }

  async leave(id) {
    await delay(200);
    const communityIndex = this.communities.findIndex(c => c.Id === parseInt(id));
    if (communityIndex === -1) throw new Error("Community not found");
    
    const community = this.communities[communityIndex];
    if (community.isJoined) {
      community.memberCount--;
      community.isJoined = false;
    }
    
    return { ...community };
  }

  async create(communityData) {
    await delay(400);
    const newCommunity = {
      Id: Math.max(...this.communities.map(c => c.Id)) + 1,
      ...communityData,
      memberCount: 1,
      isJoined: true,
      createdAt: new Date().toISOString(),
      rules: []
    };
    
    this.communities.push(newCommunity);
    return { ...newCommunity };
  }
}

export default new CommunityService();