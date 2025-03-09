<template>
  <QuillEditor theme="snow" v-model:content="dataContent" />
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import { ref } from 'vue'

const dataContent = ref(null)
</script>

<style scoped>
.quill-editor {
  min-height: 200px;
  border: 1px solid #ccc;
}
</style>
