<template>
  <div>
    <!-- Tabs for All Users / Active Members -->
    <v-tabs v-model="selectedTab">
      <v-tab value="all">All Users</v-tab>
      <v-tab value="active">Active Members</v-tab>
    </v-tabs>

    <v-window v-model="selectedTab">
      <!-- All Users Tab -->
      <v-window-item value="all">
        <UserTable :users="filteredUsers" @delete="confirmDelete" @reset="openDialog" />
      </v-window-item>

      <!-- Active Members Tab -->
      <v-window-item value="active">
        <UserTable :users="activeMembers" @delete="confirmDelete" @reset="openDialog" />
      </v-window-item>
    </v-window>

    <!-- Search Bar & Role Filter -->
    <!-- <div class="d-flex mb-4">
      <v-text-field v-model="searchQuery" label="Search Users" class="mr-4" />
      <v-select
        v-model="selectedRole"
        :items="roleOptions"
        label="Filter by Role"
        class="role-filter"
      />
    </div> -->

    <!-- Users Table -->
    <!-- <v-data-table :headers="headers" :items="filteredUsers">
      <template v-slot:item.actions="{ item }">
        <v-icon @click="openDialog(item)" class="mr-2">mdi-lock-reset</v-icon>
        <v-icon @click="confirmDelete(item)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table> -->

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this user?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteUser">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reset Password Dialog -->
    <v-dialog v-model="editDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Reset Password</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newPassword"
            label="New Password"
            type="password"
            :rules="[passwordRule]"
          />
          <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            :rules="[confirmPasswordRule]"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="blue" @click="resetPassword">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import UserTable from '../../components/admin/UserTable.vue'

const searchQuery = ref('')
const selectedRole = ref('All') // Default to show all users
const users = ref([])
const deleteDialog = ref(false)
const editDialog = ref(false)
const userToDelete = ref(null)
const userToEdit = ref(null)
const newPassword = ref('')
const confirmPassword = ref('')
const snackbar = useSnackbarStore()
const selectedTab = ref('all') // Default to "All Users"

const roleOptions = ['All', 'Member', 'Trainer'] // Dropdown options

const headers = [
  { title: 'First Name', key: 'first_name' },
  { title: 'Last Name', key: 'last_name' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone_number' },
  { title: 'Role', key: 'role_name' }, // Add Role column
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

const passwordRule = (v) => !!v || 'Password is required'
const confirmPasswordRule = (v) => v === newPassword.value || 'Passwords do not match'

onMounted(fetchUsers)
watch([searchQuery, selectedRole], fetchUsers)

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.role_name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesRole =
      selectedRole.value === 'All' ||
      user.role_name.toLowerCase() === selectedRole.value.toLowerCase()

    return matchesSearch && matchesRole
  })
})

const activeMembers = computed(() => {
  return users.value.filter((user) => user.membership_id !== null)
})

async function fetchUsers() {
  try {
    const { data } = await axios.get(`/admin/viewUsers`, {
      params: { search: searchQuery.value },
    })

    // Process users to include role names
    users.value = data.users.map((user) => ({
      ...user,
      role_name: user.role_id ? user.role_id.role : 'Unknown', // Default to "Unknown" if no role is found
    }))
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch users')
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user._id
  deleteDialog.value = true
}

const deleteUser = async () => {
  deleteDialog.value = false
  if (!userToDelete.value) return

  try {
    await axios.delete(`/admin/${userToDelete.value}`)
    snackbar.showSuccess('User deleted successfully')
    fetchUsers()
  } catch (error) {
    snackbar.handleError(error, 'Failed to delete user')
  }
}

const openDialog = (user) => {
  userToEdit.value = user
  newPassword.value = ''
  confirmPassword.value = ''
  editDialog.value = true
}

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    snackbar.showError('Passwords do not match')
    return
  }

  try {
    await axios.post('/admin/password-reset', {
      email: userToEdit.value.email,
      newPassword: newPassword.value,
    })
    snackbar.showSuccess('Password reset successfully')
    editDialog.value = false
    fetchUsers()
  } catch (error) {
    snackbar.handleError(error, 'Failed to reset password')
  }
}
</script>

<style scoped>
.v-data-table {
  text-align: left;
}
.d-flex {
  display: flex;
  gap: 10px;
}
.role-filter {
  width: 200px;
}
</style>
