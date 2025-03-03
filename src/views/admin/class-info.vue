<template>
  <div>
    <v-text-field v-model="searchQuery" label="Search Classes" class="mb-4" />

    <v-btn color="primary" class="mb-4" @click="openDialog()">Add Class</v-btn>

    <v-data-table :headers="headers" :items="filteredClasses">
      <template v-slot:item.start_time="{ item }">
        {{ formatDate(item.start_time) }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status != 'cancel' ? 'green' : 'red'" class="text-center">
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon @click="openDialog(item)" class="mr-2">mdi-pencil</v-icon>
        <v-icon @click="deleteClass(item.id)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ editMode ? 'Edit Class' : 'Add Class' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="classForm.class_name" label="Class Name" required />
          <v-select
            v-model="classForm.trainer_id"
            :items="trainers"
            item-title="user.first_name"
            item-value="id"
            label="Trainer"
            required
          />
          <v-text-field
            v-model="classForm.max_capacity"
            label="Max Capacity"
            type="number"
            required
          />
          <v-text-field
            v-model="classForm.start_time"
            label="Start Time"
            type="datetime-local"
            required
          />
          <v-text-field
            v-model="classForm.duration_mins"
            label="Duration (minutes)"
            type="number"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveClass">Save</v-btn>
          <v-btn color="secondary" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ClassService } from '@/_services/api/admin/class.service'
// import { TrainerService } from '@/_services/api/admin/trainer.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

const router = useRouter()
const searchQuery = ref('')
const dialog = ref(false)
const editMode = ref(false)
const classForm = ref({
  id: '',
  class_name: '',
  trainer_id: '',
  max_capacity: '',
  start_time: '',
  duration_mins: '',
})
const filteredClasses = ref([])
const trainers = ref([])
const snackbar = useSnackbarStore()

const headers = ref([
  { title: 'Class Name', value: 'class_name' },
  {
    title: 'Trainer',
    key: 'trainer_full_name', // Custom computed key
    align: 'start',
    cellClass: 'text-left',
  },
  { title: 'Capacity', key: 'max_capacity' },
  { title: 'Start Time', key: 'start_time' },
  { title: 'Duration', key: 'duration_mins' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
])

onMounted(() => {
  fetchClass()
  fetchTrainers()
})

const fetchClass = async () => {
  try {
    const { data } = await ClassService.getAllClass()
    filteredClasses.value = data.map((cls: any) => ({
      ...cls,
      trainer_full_name: cls.trainer?.user
        ? `${cls.trainer.user.first_name} ${cls.trainer.user.last_name}`
        : 'N/A',
    }))
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch classes')
  }
}

const fetchTrainers = async () => {
  try {
    // const { data } = await TrainerService.getAllTrainers()
    // trainers.value = data
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch trainers')
  }
}

const openDialog = (
  cls = {
    id: '',
    class_name: '',
    trainer_id: '',
    max_capacity: '',
    start_time: '',
    duration_mins: '',
  },
) => {
  classForm.value = {
    ...cls,
    start_time: cls.start_time ? moment(cls.start_time).format('YYYY-MM-DDTHH:mm') : '', // Convert to proper format
  }
  editMode.value = !!cls.id
  dialog.value = true
}

const saveClass = async () => {
  try {
    if (editMode.value) {
      //   await ClassService.updateClass(classForm.value.id, classForm.value)
    } else {
      //   await ClassService.createClass(classForm.value)
    }
    snackbar.showSuccess('Class saved successfully')
    dialog.value = false
    fetchClass()
  } catch (error) {
    snackbar.handleError(error, 'Failed to save class')
  }
}

const deleteClass = async (id: string) => {
  if (confirm('Are you sure you want to delete this class?')) {
    try {
      //   await ClassService.deleteClass(id)
      snackbar.showSuccess('Class deleted successfully')
      fetchClass()
    } catch (error) {
      snackbar.handleError(error, 'Failed to delete class')
    }
  }
}

const formatDate = (date: any) => moment(date).format('YYYY-MM-DD HH:mm A')
</script>
