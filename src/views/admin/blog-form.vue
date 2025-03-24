<template>
  <v-container class="blog-form">
    <v-card class="pa-6 rounded-xl elevation-4">
      <h2 class="text-h5 font-weight-bold mb-4">
        {{ isEditing ? 'Edit Blog Post' : 'Create Blog Post' }}
      </h2>

      <v-form @submit.prevent="handleSubmit" class="d-flex flex-column gap-4" ref="blogForm">
        <v-text-field
          v-model="form.title"
          label="Blog Title"
          prepend-inner-icon="mdi-pencil"
          outlined
          dense
          :rules="[rules.required]"
        />

        <QuillEditor
          v-model:content="form.content"
          theme="snow"
          content="html"
          contentType="html"
          :toolbar="fullToolbarOptions"
          :modules="quillModules"
        />
        <p v-if="contentError" class="error-message">{{ contentError }}</p>

        <v-text-field
          v-model="form.author"
          label="Author"
          prepend-inner-icon="mdi-account"
          outlined
          dense
          :rules="[rules.required]"
        />

        <!-- Thumbnail Image Upload -->
        <v-file-input
          label="Upload Thumbnail"
          accept="image/*"
          @change="handleFileChange"
          outlined
          dense
          prepend-icon="mdi-image"
          :rules="[rules.imageRequired]"
        />

        <!-- Thumbnail Preview -->
        <v-img
          v-if="form.thumbnail || previewUrl"
          :src="previewUrl || appConfig.VUE_APP_API_BASE_URL + form.thumbnail"
          class="mt-4 rounded-lg elevation-2"
          max-height="200"
          contain
        />

        <v-btn color="primary" type="submit" block class="mt-4 py-3 rounded-lg text-uppercase">
          {{ isEditing ? 'Update Blog' : 'Create Blog' }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader'
import axios from 'axios'
import appConfig from '../app-config'
import { BlogService } from '@/_services/api/admin/blog.service'
import { useUiStore } from '@/stores/ui.module'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

const route = useRoute()
const router = useRouter()
const uploadedImages = ref<string[]>([])
const uiStore = useUiStore()
const snackbar = useSnackbarStore()
const isEditing = ref(false)
const contentError = ref<string>('')
const form = ref({
  title: '',
  content: '',
  author: '',
  thumbnail: '',
})
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const blogForm = ref<any>(null)

const rules = {
  required: (value: string) => !!value || 'This field is required',
  imageRequired: () =>
    isEditing.value || selectedFile.value || 'Thumbnail is required for new blogs',
}

onMounted(async () => {
  if (route.params.id) {
    await fetchBlogPost()
  }
})

const fetchBlogPost = async () => {
  try {
    uiStore.setShowOverLay(true)
    isEditing.value = true
    const blog = await BlogService.getPostById(route.params.id)

    if (blog) {
      form.value = { ...blog.data }
      if (blog.data.blog_image.length > 0) previewUrl.value = blog.data.blog_image[0]
    }

    uiStore.setShowOverLay(false)
  } catch (error) {
    uiStore.setShowOverLay(false)
    snackbar.handleError(error, 'Failed to fetch blog')
  }
}

const handleFileChange = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  const valid = await blogForm.value.validate()
  if (!valid) return

  if (!form.value.content.trim()) {
    contentError.value = 'Blog content is required'
    return
  }
  contentError.value = ''

  // Handle uploaded images inside the content first
  const contentImages = Array.from(
    new DOMParser().parseFromString(form.value.content, 'text/html').querySelectorAll('img'),
  ).map((img: HTMLImageElement) => img.src)

  const imagesToRemove = uploadedImages.value.filter(
    (imageUrl: any) => !contentImages.includes(imageUrl),
  )

  for (const imageUrl of imagesToRemove) {
    await removeImage(imageUrl)
  }
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('content', form.value.content)
  formData.append('author', form.value.author)

  if (selectedFile.value) {
    formData.append('blog_images', selectedFile.value)
  }

  uiStore.setShowOverLay(true)
  try {
    if (isEditing.value) {
      await BlogService.updatePost(route.params.id, formData)
    } else {
      await BlogService.createPost(formData)
    }
    router.push('/manage-blogs')
  } catch (error) {
    snackbar.handleError(error, 'Failed to save blog')
  } finally {
    uiStore.setShowOverLay(false)
  }
}

const removeImage = async (imageUrl: string) => {
  try {
    await axios.delete('/delete-image', {
      data: { url: imageUrl.replace(appConfig.VUE_APP_API_BASE_URL, '') },
    })
    uploadedImages.value = uploadedImages.value.filter((url) => url !== imageUrl)
  } catch (error) {
    console.error('Error removing image:', error)
  }
}

const fullToolbarOptions = [
  [{ size: ['small', false, 'large', 'huge'] }, { header: '1' }, { header: '2' }, { font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  ['link'],
  [{ align: [] }],
  ['image'],
  [{ color: [] }, { background: [] }],
]

const quillModules = {
  name: 'imageUploader',
  module: ImageUploader,
  options: {
    upload: (file: any) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('image', file)

        axios
          .post('/upload-image', formData)
          .then((res) => {
            const uploadedUrl = res.data.url
            uploadedImages.value.push(uploadedUrl)
            resolve(uploadedUrl)
          })
          .catch((err) => {
            reject('Upload failed')
            console.error('Error:', err)
          })
      })
    },
  },
}
</script>

<style lang="scss">
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 4px;
}

.blog-form {
  div.ql-container.ql-snow {
    min-height: 200px;
  }
}

.blog-form {
  //   max-width: 700px;
  margin: 0 auto;
}

.v-card {
  background-color: #ffffff;
}

.v-btn {
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
