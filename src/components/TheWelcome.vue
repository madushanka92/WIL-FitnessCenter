<template>
  <v-container>
    <!-- Hero Section -->
    <v-row justify="center" class="text-center my-10">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">Welcome to Fitness Center</h1>
        <p class="text-h6">Your journey to a healthier life starts here!</p>
      </v-col>
    </v-row>

    <!-- Random Fitness Stats -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>🏋️‍♂️ 50+ Classes</v-card-title>
          <v-card-text>Join a variety of fitness classes tailored to all levels.</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>💪 20+ Certified Trainers</v-card-title>
          <v-card-text>Get expert guidance from professional trainers.</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>🔥 1000+ Happy Members</v-card-title>
          <v-card-text>Join our growing community of fitness enthusiasts.</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Call to Action -->
    <v-row justify="center" class="mt-10" v-if="!isAuthenticated">
      <v-btn to="/signup" color="primary" size="large" :disabled="isAuthenticated"
        >Get Started</v-btn
      >
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useUserAuthStore } from '@/stores/auth.module'
import { computed } from 'vue'

const userAuth = useUserAuthStore()
const isAuthenticated = computed(() => {
  return userAuth.getIsAuthenticated
})
</script>

<style scoped>
.v-card {
  padding: 20px;
  text-align: center;
}
</style>
