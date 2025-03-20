<template>
  <v-app>
    <!-- Always Open Sidebar -->
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">Admin Panel</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item
          title="Dashboard"
          prepend-icon="mdi-view-dashboard"
          @click="goToNext('/dashboard')"
        />
        <v-list-item
          title="View Users"
          prepend-icon="mdi-account-group"
          @click="goToNext('/view-users')"
        />
        <v-list-item
          title="User Roles"
          prepend-icon="mdi-account-multiple-outline"
          @click="goToNext('/user-roles')"
        />
        <v-list-item
          title="Class"
          prepend-icon="mdi-human-capacity-decrease"
          @click="goToNext('/admin-class')"
        />
        <v-list-item
          title="Trainers"
          prepend-icon="mdi-weight-lifter"
          @click="goToNext('/trainers')"
        />
        <v-list-item
          title="Promotion"
          prepend-icon="mdi-sale"
          @click="goToNext('/promotionAdmin')"
        />
        <v-list-item title="Membership" prepend-icon="mdi-crowd" @click="goToNext('/membership')" />
        <v-list-item
          title="Testimonials"
          prepend-icon="mdi-account-voice"
          @click="goToNext('/view-testimonials')"
        />
        <v-list-item
          title="Manage Blogs"
          prepend-icon="mdi-post-outline"
          @click="goToNext('/manage-blogs')"
        />

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

<script setup lang="ts">
import { useUserAuthStore } from '@/stores/auth.module'
import { useRouter } from 'vue-router'

const userAuth = useUserAuthStore()
const logout = () => {
  userAuth.setIsAuthenticated(false)
}

const router = useRouter()

const goToNext = (page: any) => {
  router.push(page)
}
</script>
