<template>
    <v-container>
        <!-- Heading Section -->
        <v-row justify="center" class="text-center my-10">
            <v-col cols="12">
                <h1 class="text-h3 font-weight-bold text-black text-shadow">
                    Continue Your Reading Journey
                </h1>
                <p class="text-h6 text-black-lighten-3">
                    Find more insights and ideas here
                </p>
            </v-col>
        </v-row>

        <!-- Related Posts Grid -->
        <v-row justify="center">
            <v-col v-for="related in relatedPosts" :key="related._id" cols="12" md="6" lg="6">
                <v-card class="related-post-card" @click="showPost(related)" elevation="4">
                    <v-img v-if="related.blog_image && related.blog_image.length > 0" :src="related.blog_image[0]"
                        alt="Blog Image" class="post-image" cover />

                    <!-- Overlay Content -->
                    <div class="overlay">
                        <v-card-title class="post-title">{{ related.title }}</v-card-title>
                        <v-card-subtitle class="post-date">{{ formatDate(related.created_at) }}</v-card-subtitle>

                        <v-card-actions>
                            <v-btn color="primary" variant="flat" block>Read More</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-col>2
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { BlogService } from '@/_services/api/admin/blog.service'

const props = defineProps<{ post_id: string }>()
const router = useRouter()
const relatedPosts = ref<any[]>([])

onMounted(async () => {
    try {
        const relatedResponse = await BlogService.getRelatedPosts(props.post_id)
        relatedPosts.value = relatedResponse.data.relatedPosts
        console.log("Related Posts Data:", relatedPosts.value) // Debugging
    } catch (error) {
        console.error('Error fetching related posts:', error)
    }
})

// Format date function
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

// Navigate to blog post
const showPost = (post: any) => {
    router.push(`/blog-post/${post._id}`)
}
</script>

<style scoped>
.text-shadow {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
}

/* Related post card styling */
.related-post-card {
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    background-color: white;
}

.related-post-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.3);
}


/* Blog post image */
.post-image {
    height: 200px;
    object-fit: cover;
}

/* Overlay styles for better readability */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Covers entire image */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)); /* Dark overlay */
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}


/* Post title */
.post-title {
    font-size: 18px;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}

/* Post date*/
.post-date {
    font-size: 14px;
    color: #f5f5f5;
    font-style: italic;
    font-weight: bolder;
    opacity: 0.9;
}
</style>