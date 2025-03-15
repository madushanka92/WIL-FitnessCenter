<template>
  <div class="d-flex flex-column align-start" style="min-height: 100vh; padding: 16px">
    <div class="search-fields">
      <v-text-field
        v-model="searchQuery"
        label="Search Classes"
        class="mb-4 w-100 search-input"
        density="comfortable"
        outlined
        @update:modelValue="debouncedFetchClasses"
        clearable
      />

      <v-text-field
        v-model="filterDate"
        label="Start Time"
        type="date"
        @update:modelValue="handleDateChange"
        class="mb-4 w-100 search-input date-input"
        clearable
      />
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredClasses"
      class="elevation-1 w-100"
      style="min-height: 50%"
      :sort-by="[{ key: 'start_time', order: 'asc' }]"
    >
      <template v-slot:item.start_time="{ item }">
        {{ formatDate(item.start_time) }}
      </template>

      <template v-slot:item.trainer="{ item }">
        {{ item.trainer_full_name || 'N/A' }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="statusColor(item.status)" class="text-center">
          {{ capitalizeWords(item.status) }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="item.user_status != 'booked'"
          color="primary"
          @click="openClassDetails(item)"
          width="80"
          >View</v-btn
        >
        <v-btn v-else color="error" @click="cancelBooking(item)" width="80">Cancel</v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="isDialogOpen" max-width="600px">
      <v-card>
        <v-card-title>Class Details</v-card-title>
        <v-card-text>
          <p v-if="selectedClass"><strong>Class Name:</strong> {{ selectedClass.class_name }}</p>
          <p v-if="selectedClass">
            <strong>Trainer:</strong> {{ selectedClass.trainer_full_name }}
          </p>
          <p v-if="selectedClass">
            <strong>Start Time:</strong> {{ formatDate(selectedClass.start_time) }}
          </p>
          <p v-if="selectedClass">
            <strong>Duration:</strong> {{ selectedClass.duration_mins }} mins
          </p>
          <p v-if="selectedClass">
            <strong>Status:</strong>
            {{ capitalizeWords(selectedClass.user_status || selectedClass.status) }}
          </p>
          <p v-if="selectedClass">
            <strong>Available Slots:</strong> {{ selectedClass.remaining_spots }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="green"
            @click="bookClass"
            :disabled="
              !selectedClass || !selectedClass.remaining_spots || selectedClass.status != 'upcoming'
            "
            >Book Class</v-btn
          >
          <v-btn color="red" @click="isDialogOpen = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import moment from 'moment'
import { ClassService } from '@/_services/api/admin/class.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { ClassBookingService } from '@/_services/api/user/class.booking.service'
import { useUiStore } from '@/stores/ui.module'
import { nextTick } from 'process'

const searchQuery = ref('')
const filterDate = ref<string | null>(null)
interface Class {
  class_name: string
  trainer_full_name: string
  start_time: string
  duration_mins: number
  status: string
  remaining_spots: number
  user_status: string
}

const filteredClasses = ref<Class[]>([])
const snackbar = useSnackbarStore()
const isDialogOpen = ref(false)
const uiStore = useUiStore()
const selectedClass = ref<any>(null)

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

const headers = ref([
  { title: 'Class Name', key: 'class_name' },
  { title: 'Trainer', key: 'trainer' },
  { title: 'Start Time', key: 'start_time' },
  { title: 'Duration', key: 'duration_mins' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
])

const fetchClasses = async () => {
  uiStore.setShowOverLay(true)
  try {
    const { data } = await ClassService.getAllClass({
      search: searchQuery.value,
      start_time: filterDate.value,
    })
    filteredClasses.value = data.map((cls: any) => ({
      ...cls,
      trainer_full_name: cls.trainer?.user
        ? `${cls.trainer.user.first_name} ${cls.trainer.user.last_name}`
        : 'N/A',
    }))
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch classes')
  } finally {
    uiStore.setShowOverLay(false)
  }
}

const debouncedFetchClasses = debounce(fetchClasses, 500)

const formatDate = (date: any) => moment(date).format('YYYY-MM-DD HH:mm A')

const statusColor = (status: string) => {
  return status === 'upcoming'
    ? 'green'
    : status === 'completed'
      ? 'blue'
      : status === 'booked'
        ? 'orange'
        : 'red'
}

const openClassDetails = (cls: any) => {
  selectedClass.value = cls
  isDialogOpen.value = true
}

const bookClass = async () => {
  uiStore.setShowOverLay(true)
  try {
    const { data } = await ClassBookingService.bookClass({
      class_id: selectedClass.value._id,
    })

    if (data.success) snackbar.showSuccess('Class booked successfully!')
    nextTick(() => {
      fetchClasses()
    })
  } catch (error) {
    snackbar.handleError(error, 'Class booking failed !')
  } finally {
    isDialogOpen.value = false
    uiStore.setShowOverLay(false)
  }
}

const handleDateChange = () => {
  fetchClasses()
}

const cancelBooking = async (cls: any) => {
  uiStore.setShowOverLay(true)
  try {
    const { data } = await ClassBookingService.cancelClassBooking({
      class_id: cls._id,
    })
    if (data.success) snackbar.showSuccess('Class cancelled successfully!')
    nextTick(() => {
      fetchClasses()
    })
  } catch (error) {
    snackbar.handleError(error, 'Class cancel failed !')
  } finally {
    uiStore.setShowOverLay(false)
  }
}

onMounted(fetchClasses)
</script>
<style lang="scss">
.search-fields {
  width: 100%;
  display: flex;
  .search-input {
    height: 50px !important;
    flex: unset !important;

    .v-input__control {
      div.v-field {
        flex: unset !important;
        width: 220px;
      }
    }
  }

  .date-input {
    > div.v-input__control {
      flex-direction: row-reverse;
    }
  }
}
</style>
