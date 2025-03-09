<template>
  <v-container class="blog-form">
    <v-form @submit.prevent="handleSubmit">
      <v-text-field v-model="form.title" label="Title" required />

      <!-- Use Quill editor component with two-way binding for content -->
      <QuillEditor
        v-model:content="form.content"
        theme="snow"
        content="html"
        contentType="html"
        :toolbar="fullToolbarOptions"
        :modules="quillModules"
      />

      <v-text-field v-model="form.author" label="Author" required />

      <v-btn color="primary" type="submit">
        {{ isEditing ? 'Update Blog' : 'Create Blog' }}
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader'
import axios from 'axios'
import appConfig from '../app-config'

const route = useRoute()
const router = useRouter()
const uploadedImages = ref<string[]>([])

const isEditing = ref(false)
const form = ref({
  title: '',
  content: '', // Content will be bound here
  author: '',
})

onMounted(() => {
  if (route.params.id) {
    isEditing.value = true
    // Fetch existing blog data and populate the form (if editing)
    // example: form.value = blogData from the store
  }
})

const handleSubmit = async () => {
  // Get the current image URLs in the content
  const contentImages = Array.from(
    new DOMParser().parseFromString(form.value.content, 'text/html').querySelectorAll('img'),
  ).map((img: HTMLImageElement) => img.src)

  // Compare with uploaded images array
  const imagesToRemove = uploadedImages.value.filter(
    (imageUrl) => !contentImages.includes(imageUrl),
  )

  // Remove images not in the content anymore
  for (const imageUrl of imagesToRemove) {
    await removeImage(imageUrl) // Call the API to remove the image
  }

  // Now save the blog
  const blogData = {
    title: form.value.title,
    content: form.value.content,
    author: form.value.author,
  }

  if (isEditing.value) {
    console.log('Updating blog:', blogData)
    // Call API to update blog
  } else {
    console.log('Creating new blog:', blogData)
    // Call API to create new blog
  }
}

const removeImage = async (imageUrl: string) => {
  try {
    await axios.delete('/delete-image', {
      data: { url: imageUrl.replace(appConfig.VUE_APP_API_BASE_URL, '') },
    })
    // Optionally, remove the image URL from the array
    uploadedImages.value = uploadedImages.value.filter((url: any) => url !== imageUrl)
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
  ['image'], // Image button in the toolbar
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
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
            uploadedImages.value.push(uploadedUrl) // Save the uploaded image URL
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
.quill-editor {
  min-height: 200px;
  border: 1px solid #ccc;
}

.blog-form {
  div.ql-container.ql-snow {
    min-height: 400px;
  }
}
</style>
