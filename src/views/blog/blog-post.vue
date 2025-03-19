<template>
  <v-container v-if="post" class="blog-post">
    <!-- Hero Section -->
    <v-card class="hero-card">
      <v-img
        v-if="post.blog_image && post.blog_image.length"
        :src="post.blog_image[0]"
        class="hero-image"
        cover
      >
        <div class="overlay d-flex flex-column justify-center align-center">
          <h1 class="text-h3 font-weight-bold text-white text-center">{{ post.title }}</h1>
          <p class="text-white text-subtitle-1 mt-2">
            By {{ post.author }} | {{ formatDate(post.created_at) }}
          </p>
        </div>
      </v-img>
    </v-card>

    <!-- Like & Dislike Buttons -->
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8" class="d-flex align-center justify-space-between">
        <v-btn
          @click="toggleLike(true)"
          color="blue-darken-2"
          variant="elevated"
          :disabled="!isAuthenticated"
        >
          <v-icon>{{ isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
          <span class="ml-2">{{ post.total_likes }}</span>
        </v-btn>

        <v-btn
          @click="toggleLike(false)"
          color="red-darken-2"
          variant="elevated"
          :disabled="!isAuthenticated"
        >
          <v-icon>{{ !isDisliked ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
          <span class="ml-2">{{ post.total_dislikes }}</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Content Section -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="12">
        <v-card class="content-card pa-6 rounded-lg elevation-3">
          <div v-html="post.content" class="blog-content"></div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Related Post  -->
    <RelatedPosts :post_id="post_id" />
    <!-- Comments Section -->
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8">
        <h3 class="text-h5 font-weight-bold mb-4">Comments ({{ comments.length }})</h3>

        <!-- Add Comment Form -->
        <v-card class="comment-input-card pa-4 mb-4 elevation-3" v-if="isAuthenticated">
          <v-row align="center">
            <v-col cols="2" class="d-flex justify-center">
              <v-avatar size="50">
                <v-img src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-textarea
                v-model="newComment"
                label="Write a comment..."
                rows="2"
                auto-grow
                hide-details
                class="comment-textarea"
              ></v-textarea>
              <v-btn
                color="blue-darken-2"
                class="mt-2"
                @click="addComment"
                :disabled="!newComment.trim()"
                >Post</v-btn
              >
            </v-col>
          </v-row>
        </v-card>

        <!-- Comments List -->
        <v-list v-if="comments.length" class="comment-list pa-3 rounded-lg">
          <v-slide-y-transition group>
            <v-list-item v-for="comment in comments" :key="comment._id" class="comment-item">
              <v-avatar size="40">
                <v-img src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png"></v-img>
              </v-avatar>

              <v-list-item-content class="comment-bubble elevation-2">
                <v-list-item-title class="font-weight-bold">
                  {{ comment.user_id?.first_name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">
                  {{ formatDate(comment.created_at) }}
                </v-list-item-subtitle>

                <!-- Inline Editing -->
                <v-textarea
                  v-if="editingCommentId === comment._id"
                  v-model="editCommentText"
                  rows="2"
                  auto-grow
                  class="comment-textarea"
                ></v-textarea>

                <v-list-item-text v-else class="comment-text mt-1">
                  {{ comment.comment_text }}
                </v-list-item-text>

                <!-- Action Buttons -->
                <v-row v-if="comment.user_id?._id === user_id" class="mt-2">
                  <v-btn
                    v-if="editingCommentId !== comment._id"
                    color="blue-darken-2"
                    size="small"
                    @click="startEditing(comment)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn v-else color="green-darken-2" size="small" @click="saveComment(comment)">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="editingCommentId === comment._id"
                    color="red-darken-2"
                    size="small"
                    @click="cancelEditing"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-btn color="red" size="small" @click="handleDelete(comment._id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-slide-y-transition>
        </v-list>

        <p v-else class="text-center text-grey">No comments yet. Be the first to comment!</p>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { BlogService } from '@/_services/api/admin/blog.service'
import { useUserAuthStore } from '@/stores/auth.module'
import { getUserID } from '@/_services/helpers/helpers'
import { useUiStore } from '@/stores/ui.module'

import RelatedPosts from '../../components/relatedPosts.vue'

const route = useRoute()
const post_id = route.params.id as string
const post = ref<any>(null)
const comments = ref<any[]>([])
const newComment = ref('')
const isLiked = ref(false)
const isDisliked = ref(false)
const userAuth = useUserAuthStore()
const editingCommentId = ref<string | null>(null)
const editCommentText = ref('')

const isAuthenticated = computed(() => {
  return userAuth.getIsAuthenticated
})

const user_id = ref(getUserID())

onMounted(async () => {
  fetchPost()
})

const fetchPost = async () => {
  try {
    const response = await BlogService.getPostById(post_id)
    post.value = response.data
    comments.value = response.data.comments || []
    isLiked.value = response.data.isLiked || false
    isDisliked.value = response.data.isLiked || false

    console.log('comments ', comments.value)
  } catch (error) {
    console.error('Error fetching blog post:', error)
  }
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const addComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const response = await BlogService.addComment({
      post_id: post_id,
      comment_text: newComment.value,
    })
    comments.value.unshift(response.data)
    newComment.value = ''

    fetchPost()
  } catch (error) {
    console.error('Error adding comment:', error)
  }
}

const toggleLike = async () => {
  try {
    const likeStatus = !isLiked.value // Determine the new like status
    const response = await BlogService.toggleLike({
      post_id: post_id,
      like: likeStatus, // Send like: true for like, false for dislike
    })

    if (likeStatus) {
      isLiked.value = true
      isDisliked.value = false
      post.value.total_likes += 1
      if (isDisliked.value) post.value.total_dislikes -= 1
    } else {
      isDisliked.value = true
      isLiked.value = false
      post.value.total_dislikes += 1
      if (isLiked.value) post.value.total_likes -= 1
    }

    fetchPost()
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const startEditing = (comment: any) => {
  editingCommentId.value = comment._id
  editCommentText.value = comment.comment_text
}

const cancelEditing = () => {
  editingCommentId.value = null
  editCommentText.value = ''
}

const saveComment = async (comment: any) => {
  try {
    await BlogService.updateBlogComment(comment._id, {
      comment_text: editCommentText.value,
    })

    // Update local comment
    const index = comments.value.findIndex((c: any) => c._id === comment._id)
    if (index !== -1) {
      comments.value[index].comment_text = editCommentText.value
    }

    cancelEditing()
  } catch (error) {
    console.error('Error updating comment:', error)
  }
}

const uiStore = useUiStore()
const deleteId = ref<any>(null)

const handleDelete = (id: string) => {
  deleteId.value = id
  uiStore.showConfirmation(
    'Delete Blog Comment',
    'Are you sure you want to delete this comment?',
    deleteComment,
  )
}

const deleteComment = async () => {
  try {
    await BlogService.deleteBlogComment(deleteId.value)
    comments.value = comments.value.filter((comment: any) => comment._id !== deleteId.value)
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}
</script>

<style lang="scss">
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

/* Content Card */
.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

/* Comment Input */
.comment-input-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
}

.comment-textarea {
  background: #f5f5f5;
  border-radius: 8px;
}

/* Comment List */
.comment-list {
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 12px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  animation: fadeIn 0.5s ease-in-out;

  .v-list-item__content {
    display: flex;
    padding-bottom: 5px;
    padding-top: 5px;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;

    .comment-bubble {
      width: 80%;
    }
  }
}

/* Comment Bubble */
.comment-bubble {
  background: white;
  border-radius: 15px;
  padding: 12px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  margin-left: 10px;
}

.comment-text {
  font-size: 0.95rem;
  color: #444;
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
