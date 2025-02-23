<template>
  <v-container class="d-flex justify-center align-center fill-height reset-password">
    <v-card class="pa-6" elevation="10" min-width="500">
      <v-card-title class="text-h5 text-center">Reset Your Password</v-card-title>
      <v-card-subtitle class="text-center">
        Enter a new password for your account.
      </v-card-subtitle>

      <v-form ref="form" v-model="isValid">
        <!-- New Password -->
        <v-text-field
          v-model="newPassword"
          label="New Password"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.password]"
          outlined
          prepend-inner-icon="mdi-lock"
        >
          <template v-slot:append>
            <v-btn icon @click="showPassword = !showPassword">
              <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
            </v-btn>
          </template>
        </v-text-field>

        <!-- Confirm Password -->
        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.confirmPassword]"
          outlined
          prepend-inner-icon="mdi-lock-check"
        ></v-text-field>

        <!-- Submit Button -->
        <v-btn
          color="primary"
          block
          class="mt-4"
          :disabled="!isValid || loading"
          :loading="loading"
          @click="resetPassword"
        >
          <v-icon left>mdi-key</v-icon> &nbsp; Reset Password
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { UserService } from '@/_services/api/user/user.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isValid = ref(false)
const form = ref()
const loading = ref(false)
const snackbar = useSnackbarStore()
const router = useRouter()
const route = useRoute()
const token = (route.params.token as string) || ''

// Validation Rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  password: (v: string) =>
    (v.length >= 8 && /^.{8,}$/.test(v)) || 'Password must be at least 8 characters',
  confirmPassword: (v: string) => v === newPassword.value || 'Passwords do not match',
}

// Reset Password Function
const resetPassword = async () => {
  if (!form.value?.validate()) return

  loading.value = true
  await UserService.resetPassword(newPassword.value, token)
    .then((res: any) => {
      loading.value = false
      if (res) {
        snackbar.notify('Password reset successfully! Redirecting...', 'success')
        setTimeout(() => router.push('/login'), 2000)
      }
    })
    .catch((err: any) => {
      if (err) snackbar.notify('Failed to reset password.', 'error')
      loading.value = false
    })
}
</script>
