<template>
  <v-app>
    <HeaderNav />
    <v-main class="d-flex align-center justify-center fill-height">
      <v-container class="text-center">
        <slot></slot>
      </v-container>
    </v-main>
    <FooterNav />
  </v-app>
</template>

<script setup lang="ts">
import HeaderNav from '@/components/HeaderNav.vue'
import FooterNav from '@/components/FooterNav.vue'
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 128px); /* Adjusts for header/footer height */
}
</style>
