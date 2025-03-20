<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="pa-6" min-width="600" max-width="800" elevation="10">
      <v-card-title class="text-h5 font-weight-bold"> Forgot Password? </v-card-title>
      <v-card-subtitle> Enter your email, and we'll send you a reset link. </v-card-subtitle>

      <v-form ref="form" v-model="isValid">
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

        <v-card-actions class="d-flex justify-center">
          <v-btn
            color="blue-darken-1"
            @click="sendResetLink"
            :loading="loading"
            :disabled="!isValid"
          >
            Send Reset Link
          </v-btn>
        </v-card-actions>
      </v-form>

      <v-alert v-if="alertText" :type="alertType" class="mt-4" closable>
        {{ alertText }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { UserService } from '@/_services/api/user/user.service'
import { ref } from 'vue'

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email format',
}

const email = ref('')
const loading = ref(false)
const isValid = ref(false)
const form = ref()
const alertText = ref<string | null>(null)
const alertType = ref<'success' | 'error'>('success')

const sendResetLink = async () => {
  if (!form.value?.validate()) {
    alertText.value = 'Please correct the errors before submitting.'
    alertType.value = 'error'
    return
  }

  loading.value = true
  alertText.value = null

  try {
    const res = await UserService.forGotPassword(email.value)
    if (res && res.data?.message) {
      alertText.value = res.data.message
      alertType.value = 'success'
    } else {
      alertText.value = 'Reset link sent successfully!'
      alertType.value = 'success'
    }
  } catch (err: any) {
    alertText.value = err?.data?.message || 'Failed to send reset link. Please try again.'
    alertType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
.fill-height {
  height: 100vh;
}
</style>
