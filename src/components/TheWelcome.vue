<template>
  <v-container>
    <!-- Hero Section -->
    <v-row justify="center" class="text-center my-12">
      <v-col cols="12" md="8">
        <h1 class="text-h2 font-weight-bold text-primary">Welcome to Fitness Center</h1>
        <p class="text-h6 mt-4">Your journey to a healthier life starts here!</p>
      </v-col>
    </v-row>

    <!-- Random Fitness Stats -->
    <v-row class="mt-6">
      <v-col cols="12" md="4" v-for="(stat, index) in stats" :key="index">
        <v-card class="pa-6" elevation="8" color="grey-lighten-5">
          <v-avatar size="64" color="primary" class="mb-4">
            <v-icon color="white">{{ stat.icon }}</v-icon>
          </v-avatar>
          <v-card-title class="text-h5 font-weight-bold">{{ stat.title }}</v-card-title>
          <v-card-text class="text-body-2">{{ stat.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Call to Action -->
    <v-row justify="center" class="mt-12">
      <v-btn to="/signup" color="primary" size="x-large" :disabled="isAuthenticated" elevation="4">
        Get Started Today
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useUserAuthStore } from '@/stores/auth.module'
import { computed } from 'vue'

const userAuth = useUserAuthStore()
const isAuthenticated = computed(() => userAuth.getIsAuthenticated)

const stats = [
  {
    icon: 'mdi-dumbbell',
    title: '50+ Classes',
    description: 'Join a variety of fitness classes tailored to all levels.',
  },
  {
    icon: 'mdi-account-multiple',
    title: '20+ Certified Trainers',
    description: 'Get expert guidance from professional trainers.',
  },
  {
    icon: 'mdi-emoticon-happy',
    title: '1000+ Happy Members',
    description: 'Join our growing community of fitness enthusiasts.',
  },
]
</script>

<style scoped>
.v-card {
  transition: transform 0.3s;
}

.v-card:hover {
  transform: translateY(-8px);
}

.text-primary {
  color: #1976d2;
}
</style>
