<template>
  <v-container class="d-flex justify-center align-center fill-height user-login">
    <v-card class="pa-6" elevation="10" min-width="560">
      <v-card-title class="text-h5 text-center" data-test="login-header">Login</v-card-title>

      <v-form ref="form" v-model="isValid">
        <!-- Email -->
        <v-text-field
          v-model="email"
          label="Email"
          :rules="[rules.required, rules.email]"
          outlined
          prepend-inner-icon="mdi-email"
          name="Email"
          data-test="email-input"
        ></v-text-field>

        <!-- Password -->
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required]"
          outlined
          prepend-inner-icon="mdi-lock"
          name="Password"
          data-test="password-input"
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
            <v-btn variant="text" color="primary" to="/forgot-password"> Forgot Password? </v-btn>
          </v-col>
        </v-row>

        <!-- Submit Button -->
        <v-btn
          color="primary"
          block
          class="mt-4"
          :disabled="!isValid"
          @click="login($event)"
          data-test="login-btn"
        >
          <v-icon left>mdi-login</v-icon> Login
        </v-btn>

        <!-- Go to Sign Up Button -->
        <v-card-text class="text-center mt-2">
          <v-btn variant="text" color="primary" to="/signup">
            Don't have an account? Sign Up
          </v-btn>
        </v-card-text>

        <v-alert :text="alertText" :type="alertType" closable v-if="alertText"></v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Cookies from 'js-cookie'
import { UserService } from '@/_services/api/user/user.service'
import { useUserAuthStore } from '@/stores/auth.module'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { useRouter } from 'vue-router'
import { getUserMembership } from '@/_services/helpers/helpers'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isValid = ref(false)
const form = ref()
const alertText = ref(undefined)
const alertType = ref('success')
const router = useRouter()

const userAuth = useUserAuthStore()
const snackbar = useSnackbarStore()

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) =>
    /^(?!.*\.{2})(?!.*\.$)(?!^\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      v.trim(),
    ) || 'Invalid email format',
}

const login = (event: Event) => {
  event.preventDefault()
  if (form.value?.validate()) {
    // alert('Login Successful!')

    if (rememberMe.value) {
      Cookies.set('rememberMe', email.value, { expires: 7 }) // Expires in 7 days
    } else {
      Cookies.remove('rememberMe')
    }

    userLogIn()
  }
}

const userLogIn = async () => {
  alertText.value = undefined
  await UserService.userLogin({
    email: email.value,
    password_hash: password.value,
  })
    .then((res: any) => {
      if (res && res.data?.message) {
        alertType.value = 'success'
        alertText.value = res.data?.message
      }

      // token
      // save it as a cookie
      // Assuming the token is in res.data.token, adjust accordingly
      const token = res.data.token
      const refreshToken = res.data.refreshToken
      // Save the token as a cookie
      Cookies.set('token', token, { secure: true, sameSite: 'Strict' })
      Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'Strict' })

      userAuth.setIsAuthenticated(true)

      const membershipID = ref(getUserMembership())

      snackbar.notify('Redirecting...', 'success')
      if (membershipID.value) setTimeout(() => router.push('/home'), 500)
      else setTimeout(() => router.push('/membership-list'), 500)
    })
    .catch((err: any) => {
      if (err && err.data?.message) {
        alertType.value = 'error'
        alertText.value = err.data?.message
      }
    })
}

onMounted(() => {
  const savedEmail = Cookies.get('rememberMe')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})
</script>

<style scoped lang="scss">
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

.user-login {
  > div {
    min-width: 560px;
  }
}
</style>
