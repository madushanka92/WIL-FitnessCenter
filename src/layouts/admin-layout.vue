<template>
  <v-app>
    <HeaderNav />
    <v-main class="align-center justify-center fill-height">
      <div class="admin-layout">
        <SideNav />
        <v-container class="text-center layout-container">
          <slot></slot>
        </v-container>
      </div>
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
import SideNav from '@/components/SideNav.vue'
import { useUiStore } from '@/stores/ui.module'
import { computed } from 'vue'

const uiStore = useUiStore()
const overlay = computed(() => {
  return uiStore.getShowOverLay
})
</script>

<style scoped lang="scss">
.fill-height {
  min-height: calc(100vh - 128px); /* Adjusts for header/footer height */
}

.admin-layout {
  display: flex;
  flex-direction: row;

  > div:first-child {
    min-width: 260px;
    width: 260px;
  }

  .layout-container {
    min-width: 800px;
  }
}
</style>
