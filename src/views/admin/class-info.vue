<template>
  <div>
    <v-text-field v-model="searchQuery" label="Search Classes" class="mb-4" />

    <div class="text-left">
      <v-btn color="primary" class="mb-4" @click="openDialog()">Add Class</v-btn>
    </div>

    <v-data-table :headers="headers" :items="filteredClasses">
      <template v-slot:item.start_time="{ item }">
        {{ formatDate(item.start_time) }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip
          :color="
            item.status === 'upcoming' ? 'green' : item.status === 'completed' ? 'blue' : 'red'
          "
          class="text-center"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon @click="openDialog(item)" :disabled="item.status === 'completed'" class="mr-2"
          >mdi-pencil</v-icon
        >
        <v-icon @click="confirmDelete(item)" :disabled="item.status !== 'upcoming'" color="red"
          >mdi-delete</v-icon
        >
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
            item-title="trainer_full_name"
            item-value="_id"
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

          <v-select
            v-if="editMode"
            v-model="classForm.status"
            :items="['upcoming', 'completed', 'canceled']"
            label="Status"
            class="mb-4"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveClass">Save</v-btn>
          <v-btn color="secondary" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this class?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteClass">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ClassService } from '@/_services/api/admin/class.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import { TrainersService } from '@/_services/api/admin/trainers.service'

const router = useRouter()
const searchQuery = ref('')
const dialog = ref(false)
const editMode = ref(false)
const classForm = ref({
  _id: '' as any,
  class_name: '' as any,
  trainer_id: '' as any,
  max_capacity: '' as any,
  start_time: '' as any,
  duration_mins: '' as any,
  trainer: '' as any,
  status: '' as any,
})
const filteredClasses = ref([])
const trainers = ref([])
const snackbar = useSnackbarStore()
const deleteDialog = ref(false)
const classToDelete = ref<string | null>(null)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

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

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchClass()
  }, 500) // Adjust delay as needed
})

const fetchClass = async () => {
  try {
    const { data } = await ClassService.getAllClass({ search: searchQuery.value })
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
    const { data } = await TrainersService.getAllTrainers()
    trainers.value = data.map((t: any) => ({
      ...t,
      trainer_full_name: t.user_id ? `${t.user_id?.first_name} ${t.user_id?.last_name}` : 'N/A',
    }))
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch trainers')
  }
}

const openDialog = (
  cls = {
    _id: '',
    class_name: '',
    trainer_id: '',
    max_capacity: '',
    start_time: '',
    duration_mins: '',
    trainer: '' as any,
  },
) => {
  classForm.value = {
    ...cls,
    start_time: cls.start_time ? moment(cls.start_time).format('YYYY-MM-DDTHH:mm') : '', // Convert to proper format
    trainer_id: cls.trainer?._id,
  }

  editMode.value = !!cls._id
  dialog.value = true
}

const saveClass = async () => {
  try {
    if (editMode.value) {
      const payload = {
        trainer_id: classForm.value.trainer_id,
        class_name: classForm.value.class_name,
        max_capacity: classForm.value.max_capacity,
        start_time: classForm.value.start_time,
        duration_mins: classForm.value.duration_mins,
        status: classForm.value.status,
      }
      await ClassService.updateClass(classForm.value._id, payload)
    } else {
      await ClassService.createClass(classForm.value)
    }
    snackbar.showSuccess('Class saved successfully')
    dialog.value = false
    fetchClass()
  } catch (error) {
    snackbar.handleError(error, 'Failed to save class')
  }
}

const confirmDelete = (cls: any) => {
  classToDelete.value = cls._id || null
  deleteDialog.value = true
}

const deleteClass = async () => {
  deleteDialog.value = false
  if (!classToDelete.value) return

  try {
    await ClassService.deleteClass(classToDelete.value)
    snackbar.showSuccess('Class deleted successfully')
    fetchClass()
  } catch (error) {
    snackbar.handleError(error, 'Failed to delete class')
  }
}

const formatDate = (date: any) => moment(date).format('YYYY-MM-DD HH:mm A')
</script>
