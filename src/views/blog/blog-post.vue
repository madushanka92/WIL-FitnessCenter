 <template>
    <v-container v-if="post">
      <v-row justify="center">
        <!-- Title and Content -->
        <v-col cols="12" md="8">
          <v-card class="blog-post-card">
            <v-img
              v-if="post.blog_image && post.blog_image.length > 0"
              :src="post.blog_image[0]" 
              alt="Blog Image"
              class="blog-image"
              height="300px"
              contain
            ></v-img>
  
            <!-- Title -->
            <v-card-title class="mt-3">
              <h1>{{ post.title }}</h1>
            </v-card-title>
            
            <!-- Content -->
            <v-card-subtitle>
              <p class="blog-content">{{ post.content }}</p>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  
    <!-- Loading indicator -->
    <div v-else>
      <p>Loading...</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { BlogService } from '@/_services/api/admin/blog.service';
  
  const route = useRoute();
  const post_id = route.params.id as string; // Get the post ID from route params
  const post = ref<any>(null); // Initialize as null
  
  onMounted(async () => {
    try {
      // Fetch the blog post by ID
      const response = await BlogService.getPostById(post_id);
      post.value = response.data; // Store the post data in the post variable
    } catch (error) {
      console.error('Error fetching blog post:', error);
    }
  });
  </script>
  
  <style scoped>
  .blog-post-card {
    padding: 20px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .blog-image {
    border-radius: 10px;
  }
  
  .v-card-title h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
  }
  
  .v-card-subtitle .blog-content {
    font-size: 1rem;
    color: #555;
    line-height: 1.8; /* Increased line height for better readability */
    margin-top: 10px;
    text-align: justify; /* Ensures the content is aligned */
    overflow-wrap: break-word; /* Ensures long words or links break properly */
    white-space: pre-wrap; /* Handles new lines from the content */
    word-wrap: break-word; /* Handles word overflow */
    max-width: 100%; /* Ensures content does not exceed the width of the container */
  }
  </style>
