<template>
  <v-container>
    <!-- Search Bar -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="search"
          label="Search by Title or Content"
          clearable
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Blog Posts -->
    <v-row justify="center" align="start">
      <v-col v-for="post in filteredPosts" :key="post._id" cols="12" md="4">
        <v-card class="post-content">
          <!-- Display Image -->
          <v-img
            v-if="post.blog_image.length > 0"
            :src="post.blog_image[0]"
            alt="Blog Image"
            height="200px"
            class="blog-image"
            contain
          ></v-img>

          <v-card-title class="mt-3">{{ post.title }}</v-card-title>
          <v-card-subtitle>{{ post.content }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { BlogService } from "@/_services/api/admin/blog.service";
import appConfig from "../app-config";

export default {
  setup() {
    const posts = ref([]);
    const search = ref("");

    onMounted(async () => {
      try {
        const response = await BlogService.getAllPosts();
        console.log(response.data); // Add this line to check the data structure
        response.data.forEach((element: any) => {
          if (element.blog_image)
            element.blog_image_url = element.blog_image;
        });
        posts.value = response.data;
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    });


    // 🛠 Computed Property for Filtering Blog Posts
    const filteredPosts = computed(() => {
      if (!search.value) return posts.value;

      return posts.value.filter((post: any) => {
        const titleMatch = post.title
          .toLowerCase()
          .includes(search.value.toLowerCase());
        const contentMatch = post.content
          ?.toLowerCase()
          .includes(search.value.toLowerCase());

        return titleMatch || contentMatch;
      });
    });

    return { posts, search, filteredPosts };
  },
};
</script>

<style scoped>
.blog-list {
  padding: 20px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-content {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.post-content:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.blog-image {
  border-radius: 10px;
}

.v-text-field {
  max-width: 400px;
  margin: 0 auto;
}
</style>
