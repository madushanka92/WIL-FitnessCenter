<template>
  <v-container class="trainers">
    <div class="add-new">
      <v-btn color="primary" @click="openDialog()">Add Trainer</v-btn>
    </div>

    <v-data-table :headers="headers" :items="trainers" item-value="_id" class="elevation-1">
      <template v-slot:item.profile_image="{ item }">
        <v-avatar size="40">
          <v-img v-if="item.profile_image" :src="item.profile_image_url" alt="Profile" />
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon @click="openDialog(item)" class="mr-2">mdi-pencil</v-icon>
        <v-icon @click="confirmDelete(item)" color="red">mdi-delete</v-icon>
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

            <!-- File Upload Field -->
            <v-file-input
              label="Profile Image"
              accept="image/*"
              @change="onFileChange"
              show-size
              prepend-icon="mdi-camera"
            ></v-file-input>

            <v-avatar
              v-if="
                editedTrainer.profile_image_url
                  ? editedTrainer.profile_image_url
                  : editedTrainer.profile_image
              "
              size="80"
              class="mt-2"
            >
              <v-img
                :src="
                  editedTrainer.profile_image_url
                    ? editedTrainer.profile_image_url
                    : editedTrainer.profile_image
                "
                alt="Profile Preview"
              />
            </v-avatar>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="validateAndSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this trainer?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteTrainer">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { TrainersService } from '@/_services/api/admin/trainers.service'
import type { VForm } from 'vuetify/components'
import { UserService } from '@/_services/api/user/user.service'
import appConfig from '@/views/app-config'

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
const editedTrainer = ref<Trainer>({
  user_id: '',
  bio_text: '',
  profile_image: '',
  specialty: '',
})
const trainerToDelete = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const snackbar = useSnackbarStore()

const form = ref<VForm | null>(null)

// Validation rules
const requiredRule = (value: string) => !!value || 'This field is required'

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

      if (element.profile_image)
        element.profile_image_url = appConfig.VUE_APP_API_BASE_URL + element.profile_image
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
    const formData = new FormData()
    formData.append('user_id', editedTrainer.value.user_id)
    formData.append('bio_text', editedTrainer.value.bio_text)
    formData.append('specialty', editedTrainer.value.specialty)

    if (selectedFile.value) {
      formData.append('profile_image', selectedFile.value)
    }

    if (isEditing.value && editedTrainer.value._id) {
      await TrainersService.updateTrainer(editedTrainer.value._id, formData)
      snackbar.notify('Trainer updated successfully', 'success')
    } else {
      await TrainersService.createTrainer(formData)
      snackbar.notify('Trainer added successfully', 'success')
    }
    closeDialog()
    fetchTrainers()
    fetchUsersForTrainer()
  } catch (error) {
    handleError(error, 'Error saving Trainer')
  }
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
    editedTrainer.value.profile_image_url = null
    editedTrainer.value.profile_image = URL.createObjectURL(input.files[0]) // Preview image
  }
}

const openDialog = (trainer: Trainer | null = null) => {
  isEditing.value = !!trainer
  editedTrainer.value = trainer
    ? {
        _id: trainer._id,
        user_id: trainer.user_id._id,
        bio_text: trainer.bio_text,
        profile_image: trainer.profile_image,
        specialty: trainer.specialty,
        full_name: trainer.full_name,
        profile_image_url: trainer.profile_image
          ? appConfig.VUE_APP_API_BASE_URL + trainer.profile_image
          : null,
      }
    : { user_id: '', bio_text: '', profile_image: '', specialty: '' }
  selectedFile.value = null
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedTrainer.value = { user_id: '', bio_text: '', profile_image: '', specialty: '' }
  selectedFile.value = null
}

const confirmDelete = (trainer: Trainer) => {
  trainerToDelete.value = trainer._id || null
  deleteDialog.value = true
}

const deleteTrainer = async () => {
  if (!trainerToDelete.value) return
  try {
    await TrainersService.deleteTrainer(trainerToDelete.value)
    snackbar.notify('Trainer deleted successfully', 'success')
    deleteDialog.value = false
    fetchTrainers()
    fetchUsersForTrainer()
  } catch (error) {
    handleError(error, 'Error deleting trainer')
  }
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
