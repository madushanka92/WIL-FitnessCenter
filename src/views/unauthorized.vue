<template>
  <v-container class="unauthorized">
    <v-row justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-icon size="100" color="red">mdi-lock-alert</v-icon>
        <h1 class="text-h4 mt-4">Unauthorized Access</h1>
        <p class="text-body-1 mt-2">You do not have permission to view this page.</p>
        <v-btn color="primary" class="mt-4" @click="goHome"> Go to Home </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/') // Redirect to the home page
}
</script>

<style scoped>
.unauthorized {
  /* min-height: 100vh; */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
