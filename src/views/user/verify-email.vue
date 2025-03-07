<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card v-if="isTokenValid" class="pa-5 text-center" elevation="5" max-width="400">
      <v-icon color="success" size="50">mdi-check-circle</v-icon>
      <h2 class="mt-2">Email Verified!</h2>
      <p>Your email has been successfully verified. You can now proceed.</p>
      <v-btn color="primary" class="mt-3" @click="goToLogin">Go to Login</v-btn>
    </v-card>

    <v-card v-else class="pa-5 text-center" elevation="5" max-width="400">
      <v-icon color="error" size="50">mdi-alert-circle</v-icon>
      <h2 class="mt-2">Verification Failed</h2>
      <p>It looks like your token is invalid or expired.</p>
      <v-btn color="primary" class="mt-3" @click="resendEmail">Resend Verification Email</v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { UserService } from '@/_services/api/user/user.service'
import { onMounted, ref } from 'vue'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { useUiStore } from '@/stores/ui.module'
import { useRoute, useRouter } from 'vue-router'

const snackbar = useSnackbarStore()
const uiStore = useUiStore()
const route = useRoute()
const router = useRouter()
const token = ref<string | null>(null)

const isTokenValid = ref<boolean | null>(null)

const verifyEmailToken = async () => {
  uiStore.setShowOverLay(true)
  await UserService.emailTokenVerification(token.value)
    .then(() => {
      uiStore.setShowOverLay(false)
      isTokenValid.value = true
    })
    .catch(() => {
      uiStore.setShowOverLay(false)
      isTokenValid.value = false
      snackbar.notify('Token Validation Failed, Try again!', 'error')
    })
}

const resendEmail = async () => {
  uiStore.setShowOverLay(true)
  await UserService.resetEmailVerification(token.value) // You'll implement this API
    .then(() => {
      uiStore.setShowOverLay(false)
      snackbar.notify('Verification email sent!', 'success')
    })
    .catch((err: any) => {
      uiStore.setShowOverLay(false)
      if (err?.data?.message) {
        snackbar.notify(err?.data?.message, 'error')
      } else snackbar.notify('Failed to send verification email.', 'error')
    })
}

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  token.value = route.params?.token as string | null
  verifyEmailToken()
})
</script>

<style scoped></style>
