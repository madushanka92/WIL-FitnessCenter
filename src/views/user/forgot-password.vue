<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="pa-6" min-width="5d00" elevation="10">
      <v-card-title class="text-h5 font-weight-bold"> Forgot Password? </v-card-title>
      <v-card-subtitle> Enter your email, and we'll send you a reset link. </v-card-subtitle>

      <v-card-text>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          variant="outlined"
          :disabled="loading"
          required
          :rules="[rules.required, rules.email]"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <v-btn color="blue-darken-1" @click="sendResetLink" :loading="loading">
          Send Reset Link
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { UserService } from '@/_services/api/user/user.service'
import { useUiStore } from '@/stores/ui.module'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
}

const email = ref('')
const loading = ref(false)
const snackbar = useSnackbarStore()
const router = useRouter()
const uiStore = useUiStore()

const sendResetLink = async () => {
  if (!email.value) {
    snackbar.notify('Please enter your email', 'error')
    return
  }

  loading.value = true

  await UserService.forGotPassword(email.value)
    .then((res: any) => {
      if (res) loading.value = false
      snackbar.notify('Reset link sent!', 'success')
    })
    .catch((err: any) => {
      if (err) snackbar.notify('Failed to send reset link. Try again.', 'error')
      loading.value = false
    })
}
</script>
