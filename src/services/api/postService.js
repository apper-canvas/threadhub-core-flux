import mockPosts from "@/services/mockData/posts.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.posts = [...mockPosts];
  }

  async getAll(filters = {}) {
    await delay(300);
    
    let filteredPosts = [...this.posts];
    
    // Filter by community
    if (filters.community) {
      filteredPosts = filteredPosts.filter(post => 
        post.community.toLowerCase() === filters.community.toLowerCase()
      );
    }
    
    // Filter by sort type
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "new":
          filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "top":
          filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
          break;
        case "rising":
          // Simple rising algorithm: recent posts with good vote ratio
          filteredPosts.sort((a, b) => {
            const aScore = (a.upvotes - a.downvotes) * (1 / (Date.now() - new Date(a.createdAt).getTime()));
            const bScore = (b.upvotes - b.downvotes) * (1 / (Date.now() - new Date(b.createdAt).getTime()));
            return bScore - aScore;
          });
          break;
        case "hot":
        default:
          // Hot algorithm: combination of votes and time
          filteredPosts.sort((a, b) => {
            const aHot = Math.log(Math.max(1, a.upvotes - a.downvotes)) / Math.pow((Date.now() - new Date(a.createdAt).getTime()) / 3600000 + 2, 1.5);
            const bHot = Math.log(Math.max(1, b.upvotes - b.downvotes)) / Math.pow((Date.now() - new Date(b.createdAt).getTime()) / 3600000 + 2, 1.5);
            return bHot - aHot;
          });
      }
    }
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredPosts.length;
    
    return {
      posts: paginatedPosts.map(post => ({ ...post })),
      hasMore,
      total: filteredPosts.length
    };
  }

async getById(id) {
    await delay(200);
    
// Input validation
    if (!id || id === '' || (typeof id !== 'number' && !/^\d+$/.test(String(id)))) {
      throw new Error(`Invalid post ID: ${id}. ID must be a positive integer or numeric string.`);
    }
    
    const parsedId = parseInt(id);
    // Handle both Id and id property cases for robust data access
    const post = this.posts.find(p => (p.Id === parsedId) || (p.id === parsedId));
    
    if (!post) {
      throw new Error(`Post with ID ${parsedId} not found. Available posts: ${this.posts.length}`);
    }
    
    return { ...post };
  }

async create(postData) {
    await delay(400);
    
    // Input validation
    if (!postData || typeof postData !== 'object') {
      throw new Error("Invalid post data provided");
    }
    
    // Generate new ID handling edge case of empty posts array
    let newId = 1;
    if (this.posts.length > 0) {
      const ids = this.posts.map(p => p.Id || p.id || 0);
      newId = Math.max(...ids) + 1;
    }
    
    const newPost = {
      Id: newId,
      ...postData,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      downvotes: 0,
      userVote: "up",
      commentCount: 0,
      saved: false
    };
    
    this.posts.unshift(newPost);
    return { ...newPost };
  }

async vote(id, voteType) {
    await delay(150);
    
// Input validation
    if (!id || id === '' || (typeof id !== 'number' && !/^\d+$/.test(String(id)))) {
      throw new Error(`Invalid post ID for voting: ${id}. Must be a positive integer or numeric string.`);
    }
    if (!voteType || !['up', 'down'].includes(voteType)) {
      throw new Error(`Invalid vote type: ${voteType}. Must be 'up' or 'down'`);
    }
    
    const parsedId = parseInt(id);
    const postIndex = this.posts.findIndex(p => (p.Id === parsedId) || (p.id === parsedId));
    
    if (postIndex === -1) {
      throw new Error(`Cannot vote: Post with ID ${parsedId} not found`);
    }
    
    const post = this.posts[postIndex];
    const currentVote = post.userVote;
    
    // Remove previous vote
    if (currentVote === "up") {
      post.upvotes--;
    } else if (currentVote === "down") {
      post.downvotes--;
    }
    
    // Apply new vote
    if (voteType === "up" && currentVote !== "up") {
      post.upvotes++;
      post.userVote = "up";
    } else if (voteType === "down" && currentVote !== "down") {
      post.downvotes++;
      post.userVote = "down";
    } else {
      post.userVote = null;
    }
    
    return { ...post };
  }

async toggleSave(id) {
    await delay(200);
    
// Input validation
    if (!id || id === '' || (typeof id !== 'number' && !/^\d+$/.test(String(id)))) {
      throw new Error(`Invalid post ID for save toggle: ${id}. Must be a positive integer or numeric string.`);
    }
    const parsedId = parseInt(id);
    const postIndex = this.posts.findIndex(p => (p.Id === parsedId) || (p.id === parsedId));
    
    if (postIndex === -1) {
      throw new Error(`Cannot toggle save: Post with ID ${parsedId} not found`);
    }
    
    this.posts[postIndex].saved = !this.posts[postIndex].saved;
    return { ...this.posts[postIndex] };
  }

async delete(id) {
    await delay(250);
    
// Input validation
    if (!id || id === '' || (typeof id !== 'number' && !/^\d+$/.test(String(id)))) {
      throw new Error(`Invalid post ID for deletion: ${id}. Must be a positive integer or numeric string.`);
    }
    const parsedId = parseInt(id);
    const postIndex = this.posts.findIndex(p => (p.Id === parsedId) || (p.id === parsedId));
    
    if (postIndex === -1) {
      throw new Error(`Cannot delete: Post with ID ${parsedId} not found`);
    }
    
    const deletedPost = this.posts.splice(postIndex, 1)[0];
    return { ...deletedPost };
  }
}

export default new PostService();