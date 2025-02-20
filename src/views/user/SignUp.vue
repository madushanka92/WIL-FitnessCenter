<template>
  <v-container class="d-flex justify-center align-center fill-height user-sign-up">
    <v-card class="pa-6" elevation="10" min-width="500">
      <v-card-title class="text-h5 text-center">Create an Account</v-card-title>

      <v-form ref="form" v-model="isValid">
        <!-- First Name & Last Name -->
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="first_name"
              label="First Name"
              :rules="[rules.required]"
              outlined
              prepend-inner-icon="mdi-account"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="last_name"
              label="Last Name"
              :rules="[rules.required]"
              outlined
              prepend-inner-icon="mdi-account"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Email -->
        <v-text-field
          v-model="email"
          label="Email"
          :rules="[rules.required, rules.email]"
          outlined
          prepend-inner-icon="mdi-email"
        ></v-text-field>

        <!-- Password -->
        <v-text-field
          v-model="password"
          label="Password"
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
          v-model="confirm_password"
          label="Confirm Password"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.confirmPassword]"
          outlined
          prepend-inner-icon="mdi-lock-check"
        ></v-text-field>

        <!-- Phone Number -->
        <v-text-field
          v-model="phone_number"
          label="Phone Number"
          :rules="[rules.required, rules.phone]"
          outlined
          prepend-inner-icon="mdi-phone"
        ></v-text-field>

        <!-- Submit Button -->
        <v-btn color="primary" block class="mt-4" :disabled="!isValid" @click="submitForm">
          <v-icon left>mdi-account-plus</v-icon> &nbsp; Sign Up
        </v-btn>

        <v-alert :text="alertText" :type="alertType" closable v-if="alertText"></v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { UserService } from '@/_services/api/user/user.service'
import { useUiStore } from '@/stores/ui.module'
import { ref } from 'vue'

const uiStore = useUiStore()

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const password = ref('')
const confirm_password = ref('')
const phone_number = ref('')
const showPassword = ref(false)
const isValid = ref(false)
const form = ref()
const alertText = ref(undefined)
const alertType = ref('success')

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
  password: (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
  confirmPassword: (v: string) => v === password.value || 'Passwords do not match',
  phone: (v: string) => /^\d{10}$/.test(v) || 'Enter a valid 10-digit phone number',
}

const submitForm = () => {
  if (form.value?.validate()) {
    console.log('Form submitted:', {
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value,
      phone_number: phone_number.value,
    })
    // alert('Account Created Successfully!');
    userSignUp()
  }
}

const userSignUp = async () => {
  alertText.value = undefined
  uiStore.setShowOverLay(true)
  await UserService.userSignUp({
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    password_hash: password.value,
    phone_number: phone_number.value,
  })
    .then((res: any) => {
      uiStore.setShowOverLay(false)
      if (res && res.data?.message) {
        alertType.value = 'success'
        alertText.value = res.data?.message
      }
    })
    .catch((err: any) => {
      uiStore.setShowOverLay(false)
      if (err && err.data?.message) {
        alertType.value = 'error'
        alertText.value = err.data?.message
      }
    })
}
</script>

<style lang="scss">
.fill-height {
  height: 100vh;
}

.user-sign-up {
  .v-alert {
    margin-top: 15px;
  }
}
</style>
