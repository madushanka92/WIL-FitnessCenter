<template>
  <v-container class="user-roles">
    <div class="add-new">
      <v-btn color="primary" @click="openDialog()">Add Role</v-btn>
    </div>

    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="roles"
      item-value="_id"
      class="elevation-1"
    >
      <template v-slot:column.role="{ column }">
        <strong>{{ column.title }}</strong>
      </template>

      <!-- <template v-slot:item.role="{ item }">
        <span class="text-left">{{ item.role }}</span> 
      </template> -->

      <template v-slot:item.isActive="{ item }">
        <v-chip :color="item.isActive ? 'green' : 'red'" class="text-center">
          {{ item.isActive ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon @click="openDialog(item)" class="mr-2">mdi-pencil</v-icon>
        <v-icon @click="confirmDelete(item)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Add/Edit Role Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditing ? 'Edit' : 'Add' }} Role</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedRole.role" label="Role" required></v-text-field>
          <v-switch v-model="editedRole.isActive" label="Active"></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveRole">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this role?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteRole">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { UserRolesService } from '@/_services/api/admin/user-roles.service'

interface UserRole {
  _id?: string
  role: string
  isActive: boolean
}

const roles = ref<UserRole[]>([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const editedRole = ref<UserRole>({ role: '', isActive: true })
const roleToDelete = ref<string | null>(null)
const snackbar = useSnackbarStore()

const headers = ref([
  { title: 'Role', key: 'role', align: 'start', cellClass: 'text-left' }, // Align header and data to left
  { title: 'Active', key: 'isActive', align: 'center' }, // Keep center for boolean values
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
])

const fetchRoles = async () => {
  try {
    const { data } = await UserRolesService.getAllRoles()
    roles.value = data
  } catch (error) {
    handleError(error, 'Failed to fetch roles')
  }
}

const saveRole = async () => {
  try {
    if (isEditing.value && editedRole.value._id) {
      await UserRolesService.updateRole(editedRole.value._id, editedRole.value)
      snackbar.notify('Role updated successfully', 'success')
    } else {
      await UserRolesService.createRole(editedRole.value)
      snackbar.notify('Role added successfully', 'success')
    }
    closeDialog()
    fetchRoles()
  } catch (error) {
    handleError(error, 'Error saving role')
  }
}

const confirmDelete = (role: UserRole) => {
  roleToDelete.value = role._id || null
  deleteDialog.value = true
}

const deleteRole = async () => {
  deleteDialog.value = false
  if (!roleToDelete.value) return
  try {
    await UserRolesService.deleteRole(roleToDelete.value)
    snackbar.notify('Role deleted', 'success')
    fetchRoles()
  } catch (error) {
    handleError(error, 'Error deleting role')
  }
}

const openDialog = (role: UserRole | null = null) => {
  isEditing.value = !!role
  editedRole.value = role ? { ...role } : { role: '', isActive: true }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedRole.value = { role: '', isActive: true }
}

const handleError = (error: unknown, defaultMessage: string) => {
  const message = (error as any)?.data?.message || defaultMessage
  snackbar.notify(message, 'error')
}

onMounted(fetchRoles)
</script>

<style lang="scss">
.user-roles {
  .add-new {
    text-align: start;
  }

  .v-data-table td:first-child {
    text-align: left !important;
  }
}
</style>
