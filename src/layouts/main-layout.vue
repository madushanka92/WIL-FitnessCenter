<template>
  <v-app>
    <HeaderNav />
    <v-main class="d-flex align-center justify-center fill-height">
      <v-container class="text-center">
        <slot></slot>
      </v-container>
    </v-main>
    <v-overlay :model-value="overlay" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <FooterNav />
  </v-app>
</template>

<script setup lang="ts">
import HeaderNav from '@/components/HeaderNav.vue'
import FooterNav from '@/components/FooterNav.vue'
import { useUiStore } from '@/stores/ui.module'
import { computed } from 'vue'

const uiStore = useUiStore()
const overlay = computed(() => {
  return uiStore.getShowOverLay
})
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 128px); /* Adjusts for header/footer height */
}
</style>
