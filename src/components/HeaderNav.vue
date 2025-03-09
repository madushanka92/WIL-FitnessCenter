<template>
  <v-app-bar app color="primary" dark>
    <!-- Logo / Title -->
    <v-app-bar-title> <v-icon left>mdi-gym</v-icon> Fitness Center </v-app-bar-title>

    <!-- Navigation Links -->
    <v-spacer></v-spacer>
    <v-btn text to="/home">Home</v-btn>
    <v-btn v-if="isAuthenticated" text to="/class-list">Classes</v-btn>
    <v-btn text to="/trainers-list">Trainers</v-btn>
    <v-btn text to="/membership-list">Membership</v-btn>
    <v-btn text to="/blog-list">Blog</v-btn>

    <v-spacer></v-spacer>

    <!-- Profile Menu (Visible if Authenticated) -->
    <v-menu v-if="isAuthenticated" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-avatar size="36">
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/profile">Profile</v-list-item>
        <v-list-item to="/my-bookings">My Bookings</v-list-item>
        <v-list-item @click="logout">Logout</v-list-item>
      </v-list>
    </v-menu>

    <!-- Login & Sign Up Buttons (Visible if Not Authenticated) -->
    <div v-else class="auth-buttons">
      <v-btn to="/login" color="secondary" class="mx-2">Login</v-btn>
      <v-btn to="/signup" color="accent" class="mx-2">Sign Up</v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useUserAuthStore } from '@/stores/auth.module'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const userAuth = useUserAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => {
  return userAuth.getIsAuthenticated
})

watch(isAuthenticated, (newVal: boolean) => {
  if (!newVal) userAuth.logout(router)
})

const logout = () => {
  userAuth.setIsAuthenticated(false)
}
</script>

<style scoped>
.v-btn {
  font-weight: bold;
}
.auth-buttons {
  display: flex;
  gap: 8px;
}
</style>
