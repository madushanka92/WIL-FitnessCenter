<script setup lang="ts">
import { useSnackbarStore } from '@/stores/useSnackbarStore'

const snackbar = useSnackbarStore()
</script>

<template>
  <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
    {{ snackbar.message }}
  </v-snackbar>
</template>
