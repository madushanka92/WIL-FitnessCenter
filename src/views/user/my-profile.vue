<template>
  <v-container class="profile-container">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="profile-card">
          <v-card-title class="text-h5 text-center"> 🚀 User Profile </v-card-title>

          <v-form ref="form" v-model="isValid" class="form-content">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user.first_name"
                  label="First Name"
                  variant="outlined"
                  color="primary"
                  :rules="nameRules"
                  :readonly="!isEditable"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user.last_name"
                  label="Last Name"
                  variant="outlined"
                  color="primary"
                  :rules="nameRules"
                  :readonly="!isEditable"
                  required
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="user.email"
              label="Email Address"
              type="email"
              variant="outlined"
              color="purple"
              :rules="emailRules"
              :readonly="!isEditable"
              required
            />

            <v-text-field
              v-model="user.phone_number"
              label="Phone Number"
              variant="outlined"
              color="success"
              :rules="phoneRules"
              :readonly="!isEditable"
            />

            <v-text-field
              v-model="password"
              label="New Password (optional)"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              color="pink"
              :disabled="!isEditable"
              :rules="passwordRules"
            >
              <template v-slot:append>
                <v-btn icon @click="showPassword = !showPassword">
                  <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                </v-btn>
              </template>
            </v-text-field>

            <v-switch
              v-model="user.reminders"
              label="Receive Email Notifications"
              color="deep-purple"
              :disabled="!isEditable"
              class="mt-3"
            />

            <!-- Save / Edit Button -->
            <v-btn
              :color="isEditable ? 'success' : 'primary'"
              block
              class="mt-4"
              @click="toggleEdit"
              :disabled="!isValid"
            >
              {{ isEditable ? '💾 Save Changes' : '✏️ Edit Profile' }}
            </v-btn>

            <!-- Cancel Button (Only in Edit Mode) -->
            <v-btn v-if="isEditable" color="error" block class="mt-2" @click="cancelEdit">
              ❌ Cancel
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { UserService } from '@/_services/api/user/user.service'
import { getUserID } from '@/_services/helpers/helpers'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

interface User {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  reminders: boolean
}

const user = ref<User>({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  reminders: true,
})

const originalUser = ref<User | null>(null) // Store original user data
const password = ref('')
const isEditable = ref(false)
const isValid = ref(false)
const snackbar = useSnackbarStore()
const showPassword = ref(false)
const form = ref()

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length <= 50) || 'Name must be less than 50 characters',
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const phoneRules = [
  (v: string) =>
    !v ||
    /^(?:\+1|1)?(?:[2-9][0-9]{2})[2-9][0-9]{6}$/.test(v) ||
    'Enter a valid Canadian phone number (e.g., +1 416-123-4567)',
]

const passwordRules = [
  (v: string) =>
    !v || (v.length === 8 && /^.{8}$/.test(v)) || 'Password must be exactly 8 characters long',
]

const fetchUserProfile = async () => {
  try {
    const response = await UserService.getUserById(getUserID())
    user.value = response.data.data
    originalUser.value = JSON.parse(JSON.stringify(response.data.data)) // Store a deep copy of user data
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch user profile')
  }
}

const saveProfile = async () => {
  try {
    const updatedData: any = { ...user.value }
    if (password.value) {
      updatedData.password = password.value
    }
    const response = await UserService.updateUserData(getUserID(), updatedData)
    if (response.status === 200) {
      snackbar.showSuccess('Profile updated successfully')
      originalUser.value = JSON.parse(JSON.stringify(user.value))
      isEditable.value = false
    }
  } catch (error) {
    snackbar.handleError(error, 'Failed to update profile')
  }
}

const toggleEdit = () => {
  if (isEditable.value) {
    if (form.value?.validate()) saveProfile()
  } else {
    isEditable.value = true
  }
}

const cancelEdit = () => {
  if (originalUser.value) {
    user.value = JSON.parse(JSON.stringify(originalUser.value))
    password.value = ''
    isEditable.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped lang="scss">
.profile-container {
  padding: 30px;
}

.profile-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-content {
  padding: 20px;
}

.v-btn {
  font-size: 18px;
  font-weight: bold;
}

.v-text-field ::v-deep(input) {
  border-radius: 8px;
}
</style>
