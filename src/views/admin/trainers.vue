<template>
  <v-container class="trainers">
    <div class="add-new">
      <v-btn color="primary" @click="openDialog()">Add Trainer</v-btn>
    </div>

    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="trainers" item-value="_id"
      class="elevation-1">
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
          <v-text-field v-model="editedTrainer.user_id" label="User ID" required></v-text-field>
          <v-text-field v-model="editedTrainer.bio_text" label="Bio" required></v-text-field>
          <v-text-field v-model="editedTrainer.specialty" label="Specialty" required></v-text-field>
          <v-text-field v-model="editedTrainer.profile_image" label="Profile Image URL"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveTrainer">Save</v-btn>
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

interface Trainer {
  _id?: string
  user_id: string
  bio_text: string
  profile_image: string
  specialty: string
}

const trainers = ref<Trainer[]>([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const editedTrainer = ref<Trainer>({ user_id: '', bio_text: '', profile_image: '', specialty: '' })
const trainerToDelete = ref<string | null>(null)
const snackbar = useSnackbarStore()


const headers = ref([
  { title: 'User', key: 'full_name', align: 'start' },
  { title: 'Bio', key: 'bio_text', align: 'start' },
  { title: 'Specialty', key: 'specialty', align: 'start' },
  { title: 'Profile', key: 'profile_image', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
])

const fetchTrainers = async () => {
  try {
    const { data } = await TrainersService.getAllTrainers();
    console.log("A >> ", data);
    data.forEach((element: any) => {
      element.full_name = element.user_id.first_name + " " + element.user_id.last_name;
    });
    trainers.value = data;
  } catch (error) {
    handleError(error, "Failed to fetch trainers");
  }

};

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
  } catch (error) {
    handleError(error, 'Error saving role')
  }
}



const openDialog = (role: Trainer | null = null) => {
  isEditing.value = !!role
  // editedRole.value = role ? { ...role } : { role: '', isActive: true }
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



onMounted(fetchTrainers)
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