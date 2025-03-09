<template>
  <v-container>
    <!-- Search Bar -->
    <v-row justify="center" v-if="isAuthenticated">
      <v-col cols="12" md="18">
        <v-text-field
          v-model="search"
          label="Search blog posts"
          clearable
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          class="mb-4 search-bar"
        />
      </v-col>
    </v-row>

    <!-- Blog Posts or No Results -->
    <v-row style="min-height: 400px">
      <!-- ✅ IF POSTS ARE FOUND -->
      <template v-if="filteredPosts.length > 0">
        <v-col v-for="post in filteredPosts" :key="post._id" cols="12" sm="6" md="4">
          <v-card class="post-card" elevation="2" @click="showPost(post)">
            <v-img
              v-if="post.blog_image.length > 0"
              :src="post.blog_image[0]"
              alt="Blog Image"
              height="200px"
              class="blog-image"
              cover
            />

            <v-card-title class="text-h6 font-weight-bold mt-2">
              {{ post.title }}
            </v-card-title>

            <v-card-text class="blog-preview">
              <div v-html="truncatedContent(post.content)" />
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" text>Read More</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>

      <!-- ✅ IF NO RESULTS ARE FOUND -->
      <template v-else>
        <v-col cols="12" class="text-center mt-5">
          <v-icon size="60" color="grey">mdi-database-remove</v-icon>
          <p class="text-h6 font-weight-medium mt-3">No blog posts found</p>
          <p class="text-grey">Try a different search keyword.</p>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { BlogService } from '@/_services/api/admin/blog.service'
import { useRouter } from 'vue-router'
import { useUserAuthStore } from '@/stores/auth.module'

const posts = ref<any[]>([])
const search = ref('')
const loading = ref(true)
const router = useRouter()

onMounted(async () => {
  try {
    const response = await BlogService.getAllPosts()
    posts.value = response.data
  } catch (error) {
    console.error('Error fetching blog posts:', error)
  } finally {
    loading.value = false
  }
})

// ✅ Function to open the blog post
const showPost = (post: any) => {
  router.push('/blog-post/' + post._id)
}

const userAuth = useUserAuthStore()

const isAuthenticated = computed(() => {
  return userAuth.getIsAuthenticated
})

// ✅ Computed property for search filter
const filteredPosts = computed(() => {
  if (!search.value) return posts.value

  return posts.value.filter((post: any) => {
    const titleMatch = post.title.toLowerCase().includes(search.value.toLowerCase())
    const contentMatch = post.content?.toLowerCase().includes(search.value.toLowerCase())
    return titleMatch || contentMatch
  })
})

// ✅ Function to truncate content
const truncatedContent = (content: string) => {
  const maxLength = 150
  const textContent = new DOMParser().parseFromString(content, 'text/html').body.textContent || ''
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent
}

// ✅ Function to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
/* 🔥 Modernized Search Bar */
.search-bar {
  max-width: 500px;
  margin-bottom: 30px;
}

/* ✅ Modern Card Styling */
.post-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 🖼️ Blog Image */
.blog-image {
  height: 200px;
  width: 100%;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
}

/* 📄 Blog Text */
.blog-preview {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

/* ✅ Button Hover Effect */
.v-btn {
  text-transform: none;
}

/* ✅ Skeleton Loader */
.skeleton-card {
  border-radius: 12px;
  margin-bottom: 20px;
}
</style>
