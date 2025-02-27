<template>
  <v-container class="trainers">
    <div class="add-new">
      <v-btn color="primary" @click="openDialog()">Add Trainer</v-btn>
    </div>

    <v-data-table :headers="headers" :items="trainers" item-value="_id" class="elevation-1">
      <template v-slot:item.profile_image="{ item }">
        <v-avatar size="40">
          <v-img v-if="item.profile_image" :src="item.profile_image" alt="Profile" />
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon @click="openDialog(item)" class="mr-2">mdi-pencil</v-icon>
        <!-- <v-icon @click="confirmDelete(item)" color="red">mdi-delete</v-icon> -->
      </template>
    </v-data-table>

    <!-- Add/Edit Trainer Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditing ? 'Edit' : 'Add' }} Trainer</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-select
              v-model="editedTrainer.user_id"
              label="User"
              :items="users"
              item-title="full_name"
              item-value="_id"
              :rules="[requiredRule]"
              required
              v-if="!isEditing"
            ></v-select>

            <v-text-field
              v-model="editedTrainer.full_name"
              label="User"
              v-if="isEditing"
              readonly
            ></v-text-field>

            <v-text-field
              v-model="editedTrainer.bio_text"
              label="Bio"
              :rules="[requiredRule]"
              required
            ></v-text-field>

            <v-text-field
              v-model="editedTrainer.specialty"
              label="Specialty"
              :rules="[requiredRule]"
              required
            ></v-text-field>

            <v-text-field
              v-model="editedTrainer.profile_image"
              label="Profile Image URL"
              :rules="[urlRule]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="validateAndSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <!-- <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this trainer?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteTrainer">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { TrainersService } from '@/_services/api/admin/trainers.service'
import type { VForm } from 'vuetify/components'
import { UserService } from '@/_services/api/user/user.service'

interface Trainer {
  _id?: string
  user_id: any
  bio_text: string
  profile_image: string
  specialty: string
  full_name?: string
}

interface User {
  _id: string
  first_name: string
  last_name: string
  full_name?: string
}

const trainers = ref<Trainer[]>([])
const users = ref<User[]>([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const editedTrainer = ref<Trainer>({ user_id: '', bio_text: '', profile_image: '', specialty: '' })
const trainerToDelete = ref<string | null>(null)
const snackbar = useSnackbarStore()

const form = ref<VForm | null>(null)

// Validation rules
const requiredRule = (value: string) => !!value || 'This field is required'
const urlRule = (value: string) => {
  if (!value) return true // Allow empty field
  const pattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i
  return pattern.test(value) || 'Enter a valid image URL (png, jpg, jpeg, gif, svg)'
}

const headers = ref([
  { title: 'User', key: 'full_name', align: 'start' },
  { title: 'Bio', key: 'bio_text', align: 'start' },
  { title: 'Specialty', key: 'specialty', align: 'start' },
  { title: 'Profile', key: 'profile_image', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
])

const fetchTrainers = async () => {
  try {
    const { data } = await TrainersService.getAllTrainers()
    data.forEach((element: any) => {
      element.full_name = element.user_id.first_name + ' ' + element.user_id.last_name
    })
    trainers.value = data
  } catch (error) {
    handleError(error, 'Failed to fetch trainers')
  }
}

const validateAndSave = async () => {
  const { valid } = (await form.value?.validate()) || { valid: false }
  if (!valid) return

  saveTrainer()
}

const saveTrainer = async () => {
  try {
    if (isEditing.value && editedTrainer.value._id) {
      // await TrainersService.updateRole(editedRole.value._id, editedRole.value)
      snackbar.notify('Role updated successfully', 'success')
    } else {
      await TrainersService.createTrainer(editedTrainer.value)
      snackbar.notify('Role added successfully', 'success')
    }
    closeDialog()
    fetchTrainers()
    fetchUsersForTrainer()
  } catch (error) {
    handleError(error, 'Error saving role')
  }
}

const openDialog = (role: Trainer | null = null) => {
  isEditing.value = !!role
  editedTrainer.value = role
    ? {
        _id: role._id,
        user_id: role.user_id._id,
        bio_text: role.bio_text,
        profile_image: role.profile_image,
        specialty: role.specialty,
        full_name: role.full_name,
      }
    : { role: '', isActive: true }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedTrainer.value = { role: '', isActive: true }
}

const handleError = (error: unknown, defaultMessage: string) => {
  const message = (error as any)?.data?.message || defaultMessage
  snackbar.notify(message, 'error')
}

const fetchUsersForTrainer = async () => {
  try {
    const { data } = await UserService.getAllUsersForTrainer()
    users.value = data.users.map((user: any) => ({
      _id: user._id,
      full_name: `${user.first_name} ${user.last_name}`,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  fetchTrainers()
  fetchUsersForTrainer()
})
</script>

<style lang="scss">
.trainers {
  .add-new {
    text-align: start;
  }

  .v-data-table td:first-child {
    text-align: left !important;
  }
}
</style>
