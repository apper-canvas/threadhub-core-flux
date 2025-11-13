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
    
    // Enhance community data with branding information
    const enhancedCommunity = {
      ...community,
      theme: {
        primaryColor: community.theme?.primaryColor || this.getCommunityBrandColor(name),
        secondaryColor: community.theme?.secondaryColor || this.getCommunitySecondaryColor(name),
        accentColor: community.theme?.accentColor || this.getCommunityAccentColor(name),
        backgroundColor: community.theme?.backgroundColor || this.getCommunityBackgroundColor(name),
        textColor: community.theme?.textColor || '#1a202c'
      },
      category: community.category || this.getCommunityCategory(name),
      rank: community.rank || Math.floor(Math.random() * 500) + 1,
      longDescription: community.longDescription || this.generateLongDescription(community),
      rules: community.rules || this.generateCommunityRules(name),
      moderators: community.moderators || this.generateModerators(name),
      relatedCommunities: community.relatedCommunities || this.getRelatedCommunities(name)
    };
    
    return enhancedCommunity;
  }

  getCommunityBrandColor(name) {
    const colors = ['#FF4500', '#1976D2', '#388E3C', '#7B1FA2', '#D32F2F', '#F57C00', '#512DA8', '#00796B'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }

  getCommunitySecondaryColor(name) {
    const colors = ['#0079D3', '#FF4500', '#1976D2', '#388E3C', '#7B1FA2', '#D32F2F', '#F57C00', '#512DA8'];
    const index = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 1) % colors.length;
    return colors[index];
  }

  getCommunityAccentColor(name) {
    const colors = ['#FF8717', '#4FC3F7', '#81C784', '#BA68C8', '#EF5350', '#FFB74D', '#7986CB', '#4DB6AC'];
    const index = (name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 2) % colors.length;
    return colors[index];
  }

  getCommunityBackgroundColor(name) {
    const primary = this.getCommunityBrandColor(name);
    return `${primary}08`; // Very light transparency
  }

  getCommunityCategory(name) {
    const categories = ['Technology', 'Gaming', 'Science', 'Art', 'Music', 'Sports', 'Education', 'Entertainment', 'News', 'Discussion'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % categories.length;
    return categories[index];
  }

  generateLongDescription(community) {
    return `${community.description} Join our growing community of ${community.memberCount.toLocaleString()} members who share a passion for meaningful discussions and quality content.`;
  }

  generateCommunityRules(name) {
    const baseRules = [
      { title: "Be respectful", description: "Treat all members with courtesy and respect" },
      { title: "Stay on topic", description: "Keep discussions relevant to the community theme" },
      { title: "No spam or self-promotion", description: "Avoid excessive promotional content" },
      { title: "Use appropriate language", description: "Keep content suitable for all audiences" }
    ];
    return baseRules.slice(0, Math.floor(Math.random() * 4) + 2);
  }

  generateModerators(name) {
    const modNames = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan'];
    const modCount = Math.floor(Math.random() * 3) + 1;
    return modNames.slice(0, modCount).map(modName => ({
      username: `${modName.toLowerCase()}_mod_${name}`,
      avatar: `https://ui-avatars.com/api/?name=${modName}&background=random`,
      role: 'Moderator'
    }));
  }

  getRelatedCommunities(currentName) {
    const related = this.communities
      .filter(c => c.name !== currentName)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return related;
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