<template>
  <v-app>
    <!-- Always Open Sidebar -->
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">Admin Panel</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" to="/" />
        <v-list-item title="Profile" prepend-icon="mdi-account" to="/profile" />
        <v-list-item title="Settings" prepend-icon="mdi-cog" to="/settings" />
        <v-list-item title="View Users" prepend-icon="mdi-account-group" to="/view-users" />
        <v-list-item title="User Roles" prepend-icon="mdi-cog" to="/user-roles" />
        <v-list-item title="Class" prepend-icon="mdi-human-capacity-decrease" to="/admin-class" />
        <v-list-item title="Trainers" prepend-icon="mdi-cog" to="/trainers" />
        <v-list-item title="Promotion" prepend-icon="mdi-cog" to="/promotionAdmin" />
        <v-list-item title="Testimonials" prepend-icon="mdi-message-draw" to="/view-testimonials" />

        <v-divider />
        <v-list-item title="Logout" prepend-icon="mdi-logout" @click="logout" />
      </v-list>
    </v-navigation-drawer>

    <!-- App Content -->
    <v-main class="pa-4">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { useUserAuthStore } from '@/stores/auth.module'

const userAuth = useUserAuthStore()
const logout = () => {
  userAuth.setIsAuthenticated(false)
}
</script>
