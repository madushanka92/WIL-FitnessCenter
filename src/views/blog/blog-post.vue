<template>
  <v-container v-if="post" class="blog-post">
    <!-- Hero Section -->
    <v-card class="hero-card">
      <v-img
        v-if="post.blog_image && post.blog_image.length > 0"
        :src="post.blog_image[0]"
        alt="Blog Image"
        class="hero-image"
        cover
      >
        <div class="overlay d-flex flex-column justify-center align-center">
          <h1 class="text-h3 font-weight-bold text-white text-center">
            {{ post.title }}
          </h1>
          <p class="text-white text-subtitle-1 mt-2">
            By {{ post.author }} | {{ formatDate(post.created_at) }}
          </p>
        </div>
      </v-img>
    </v-card>

    <!-- Content Section -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="12">
        <v-card class="content-card pa-6 rounded-lg elevation-2">
          <div v-html="post.content" class="blog-content"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Skeleton Loader -->
  <v-container v-else>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-skeleton-loader
          class="skeleton-loader"
          :loading="!post"
          type="article, image, heading"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BlogService } from '@/_services/api/admin/blog.service'

const route = useRoute()
const post_id = route.params.id as string
const post = ref<any>(null)

onMounted(async () => {
  try {
    const response = await BlogService.getPostById(post_id)
    post.value = response.data
  } catch (error) {
    console.error('Error fetching blog post:', error)
  }
})

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
/* Hero Section */
.hero-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 400px;
}

.hero-image {
  height: 100%;
  filter: brightness(0.7);
}

.overlay {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
}

.overlay h1 {
  text-shadow: 1px 1px 12px rgba(0, 0, 0, 0.5);
}

/* Content Card */
.content-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.6s ease-in-out;
}

.blog-content {
  font-size: 1.1rem;
  color: #444;
  line-height: 1.8;
  text-align: justify;
}

.blog-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

/* Loading Skeleton */
.skeleton-loader {
  max-width: 800px;
  margin: 0 auto;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
