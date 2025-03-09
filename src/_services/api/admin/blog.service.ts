import appConfig from '@/views/app-config';
import ApiService from '../api.service';

ApiService.init(appConfig.VUE_APP_ROOT_API);

const BlogService = {
  // Get all blog posts
  async getAllPosts() {
    const url = 'blogPost';
    return await ApiService.get(url);
  },

  // Get a specific blog post by ID
  async getPostById(id: any) {
    const url = `blogPost/${id}`;
    return await ApiService.get(url);
  },

  // Update a blog post
  async updatePost(id: any, payload: any) {
    const url = 'blogPost';
    return await ApiService.put(url, id, payload);
  },

  // Delete a blog post
  async deletePost(id: any, payload?: any) {
    const url = 'blogPost';
    return await ApiService.delete(url, id);
  },

  // Create a new blog post
  async createPost(payload: any) {
    const url = 'blogPost';
    return await ApiService.post(url, payload);
  },
}

export { BlogService };
