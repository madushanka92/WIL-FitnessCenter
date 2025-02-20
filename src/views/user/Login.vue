<template>
  <v-container class="d-flex justify-center align-center fill-height user-login">
    <v-card class="pa-6" elevation="10" min-width="400">
      <v-card-title class="text-h5 text-center">Login</v-card-title>

      <v-form ref="form" v-model="isValid">
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
          :rules="[rules.required]"
          outlined
          prepend-inner-icon="mdi-lock"
        >
          <template v-slot:append>
            <v-btn icon @click="showPassword = !showPassword">
              <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
            </v-btn>
          </template>
        </v-text-field>

        <!-- Remember Me & Forgot Password -->
        <v-row align="center">
          <v-col cols="6">
            <v-checkbox v-model="rememberMe" label="Remember Me" dense></v-checkbox>
          </v-col>
          <v-col cols="6" class="text-right">
            <a href="#" class="forgot-password">Forgot Password?</a>
          </v-col>
        </v-row>

        <!-- Submit Button -->
        <v-btn color="primary" block class="mt-4" :disabled="!isValid" @click="login">
          <v-icon left>mdi-login</v-icon> Login
        </v-btn>

        <!-- Go to Sign Up Button -->
        <v-card-text class="text-center mt-2">
          <v-btn variant="text" color="primary" to="/signup">
            Don't have an account? Sign Up
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isValid = ref(false)
const form = ref()

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
}

const login = () => {
  if (form.value?.validate()) {
    console.log('Logging in with:', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    })
    // alert('Login Successful!')

    if (rememberMe.value) {
      Cookies.set('rememberMe', email.value, { expires: 7 }) // Expires in 7 days
    } else {
      Cookies.remove('rememberMe')
    }
  }
}

onMounted(() => {
  const savedEmail = Cookies.get('rememberMe')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
.forgot-password,
.sign-up-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}
.forgot-password:hover,
.sign-up-link:hover {
  text-decoration: underline;
}
</style>
