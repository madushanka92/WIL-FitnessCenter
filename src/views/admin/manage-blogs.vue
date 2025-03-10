<template>
  <v-container>
    <!-- New Blog Button -->
    <v-row justify="end">
      <v-btn color="primary" @click="router.push('/manage-blogs/create')" class="mb-4">
        + New Blog
      </v-btn>
    </v-row>

    <!-- Data Table for Blog Posts -->
    <v-data-table
      :items="blogStore"
      :headers="[
        { text: 'Title', value: 'title' },
        { text: 'Author', value: 'author' },
        { text: 'Date', value: 'created_at' },
        { text: 'Actions', value: 'actions' },
      ]"
      item-key="_id"
      class="elevation-1"
    >
      <!-- Date Formatting -->
      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <v-btn size="small" color="blue" @click="handleEdit(item._id)" class="mr-2"> Edit </v-btn>
        <v-btn size="small" color="red" @click="handleDelete(item._id)"> Delete </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BlogService } from '@/_services/api/admin/blog.service'
import { useUiStore } from '@/stores/ui.module'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import moment from 'moment'

const router = useRouter()
const blogStore = ref([])
const uiStore = useUiStore()
const deleteId = ref<any>(null)
const snackbar = useSnackbarStore()

onMounted(async () => {
  fetchBlogs()
})

const fetchBlogs = async () => {
  try {
    const blogs = await BlogService.getAllPosts()
    blogStore.value = blogs.data
  } catch (error) {
    snackbar.handleError(error, 'Failed to load blog posts')
  }
}

const formatDate = (date: any) => moment(date).format('YYYY-MM-DD HH:mm A')

const handleEdit = (id: string) => {
  router.push(`/manage-blogs/edit/${id}`)
}

const handleDelete = (id: string) => {
  deleteId.value = id
  uiStore.showConfirmation(
    'Delete Blog Post',
    'Are you sure you want to delete this blog?',
    deleteBlogPost,
  )
}

const deleteBlogPost = async () => {
  try {
    await BlogService.deletePost(deleteId.value)
    fetchBlogs()
  } catch (error) {
    snackbar.handleError(error, 'Failed to delete blog post')
  } finally {
    uiStore.setShowOverLay(false)
  }
}
</script>

<style scoped>
/* Table Styling */
.v-data-table {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-data-table-header {
  background-color: #f8f9fa;
}

.v-btn {
  text-transform: none;
}

/* Hover Effects for Table Rows */
.v-data-table__wrapper .v-data-table__row:hover {
  background-color: #f1f1f1;
}

/* Button Margin */
.mb-4 {
  margin-bottom: 16px;
}
</style>
