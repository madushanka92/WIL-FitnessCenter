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
              :rules="[rules.require, rules.firstName]"
              outlined
              prepend-inner-icon="mdi-account"
              maxlength="15"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="last_name"
              label="Last Name"
              :rules="[rules.required, rules.lastName]"
              outlined
              prepend-inner-icon="mdi-account"
              maxlength="20"
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
          maxlength="8"
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
          maxlength="8"
        ></v-text-field>

        <!-- Phone Number -->
        <v-text-field
          v-model="phone_number"
          label="Phone Number"
          :rules="[rules.required, rules.phone]"
          outlined
          prepend-inner-icon="mdi-phone"
          maxlength="14"
           prefix="+1 "
        ></v-text-field>

        <!-- Submit Button -->
        <v-btn color="primary" block class="mt-4" :disabled="!isValid" @click="submitForm">
          <v-icon left>mdi-account-plus</v-icon> &nbsp; Sign Up
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const password = ref('')
const confirm_password = ref('')
const phone_number = ref('')
const showPassword = ref(false)
const isValid = ref(false)
const form = ref()

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
  password: (v: string) =>
    (v.length >= 8 && /^.{8}$/.test(v)) || 'Password must be exactly 8 characters long',
  confirmPassword: (v: string) => v === password.value || 'Password does not match',
  phone: (v: string) =>
    /^(?:\+1|1)?(?:[2-9][0-9]{2})[2-9][0-9]{6}$/.test(v) || 'Enter a valid Canadian phone number (e.g., +1 416-123-4567)',
 firstName: (v: string) =>
    /^[A-Za-z]{2,15}$/.test(v) || 'Only characters allowed (2-15 characters)',
  lastName: (v: string) =>
    /^[A-Za-z]{2,20}$/.test(v) || 'Only characters allowed (2-20 characters)',
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
    alert('Account Created Successfully!')
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
