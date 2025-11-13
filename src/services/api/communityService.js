import mockCommunities from "@/services/mockData/communities.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommunityService {
  constructor() {
    this.communities = this.enhanceCommunityData([...mockCommunities]);
  }

  enhanceCommunityData(communities) {
    return communities.map(community => ({
      ...community,
      postCount: Math.floor(Math.random() * 50000) + 1000,
      rules: this.generateCommunityRules(community.name),
      theme: this.generateCommunityTheme(community.name)
    }));
  }

  generateCommunityRules(communityName) {
    const ruleTemplates = [
      "Be respectful and civil in all interactions",
      "No spam, self-promotion, or duplicate posts",
      "Stay on topic and relevant to the community",
      "No harassment, hate speech, or personal attacks",
      "Follow Reddit's content policy and guidelines",
      "Use descriptive titles for your posts",
      "Mark spoilers and NSFW content appropriately"
    ];
    
    return ruleTemplates.slice(0, Math.floor(Math.random() * 5) + 3);
  }

  generateCommunityTheme(communityName) {
    const themes = {
      'gaming': {
        primaryColor: '#9146FF',
        bannerGradient: 'linear-gradient(135deg, #9146FF 0%, #FF6B35 100%)',
        pattern: '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 15l15 15-15 15-15-15z" fill="currentColor"/></svg>'
      },
      'technology': {
        primaryColor: '#00D4FF',
        bannerGradient: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        pattern: '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="3" fill="currentColor"/></svg>'
      },
      'science': {
        primaryColor: '#00C851',
        bannerGradient: 'linear-gradient(135deg, #00C851 0%, #007E33 100%)',
        pattern: '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 10v40M10 30h40" stroke="currentColor" stroke-width="2"/></svg>'
      }
    };

    const defaultTheme = {
      primaryColor: '#FF4500',
      bannerGradient: 'linear-gradient(135deg, #FF4500 0%, #FF8717 100%)',
      pattern: null
    };

    return themes[communityName.toLowerCase()] || defaultTheme;
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