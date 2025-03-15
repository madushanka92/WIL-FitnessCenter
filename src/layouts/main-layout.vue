<template>
  <v-app>
    <HeaderNav />
    <v-main class="align-center justify-center fill-height">
      <v-container class="text-center main-layout-container">
        <slot></slot>
      </v-container>
    </v-main>
    <v-overlay :model-value="overlay" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <FooterNav />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="confirmationDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">{{ confirmationTitle }}</v-card-title>
        <v-card-text>{{ confirmationMsg }}</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="cancelConfirm">No</v-btn>
          <v-btn color="red" @click="confirmRequest">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

const confirmationTitle = computed(() => {
  return uiStore.getConfirmationTitle
})

const confirmationMsg = computed(() => {
  return uiStore.getConfirmationMsg
})

const cancelConfirm = () => {
  uiStore.cancelConfirm()
}

const confirmRequest = () => {
  uiStore.confirmRequest()
}

const confirmationDialog = computed(() => {
  return uiStore.getIsConfirmVisible
})
</script>

<style lang="scss">
.fill-height {
  min-height: calc(100vh - 128px); /* Adjusts for header/footer height */
}

.main-layout-container {
  // height: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: center;

  // > div.content {
  //   height: 100%;
  // }
}
</style>
