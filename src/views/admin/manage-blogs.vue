<template>
  <v-container>
    <v-row justify="end">
      <v-btn color="primary" @click="router.push('/manage-blogs/create')"> + New Blog </v-btn>
    </v-row>

    <v-data-table
      :items="blogStore"
      :headers="[
        { text: 'Title', value: 'title' },
        { text: 'Author', value: 'author' },
        { text: 'Date', value: 'createdAt' },
        { text: 'Actions', value: 'actions' },
      ]"
    >
      <template #item.actions="{ item }">
        <v-btn size="small" color="blue" @click="handleEdit(item.id)"> Edit </v-btn>
        <v-btn size="small" color="red" @click="handleDelete(item.id)"> Delete </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const blogStore = ref([])

onMounted(() => {})

const handleEdit = (id: string) => {
  router.push(`/admin/blogs/edit/${id}`)
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this blog?')) {
    await blogStore.deleteBlog(id)
  }
}
</script>
