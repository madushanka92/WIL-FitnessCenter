<template>
  <div class="d-flex flex-column align-start" style="min-height: 100vh; padding: 16px">
    <v-text-field
      v-model="searchQuery"
      label="Search Classes"
      class="mb-4 w-100 search-input"
      density="comfortable"
      outlined
      @input="debouncedFetchClasses"
    />

    <v-data-table
      :headers="headers"
      :items="filteredClasses"
      class="elevation-1 w-100"
      style="min-height: 50%"
    >
      <template v-slot:item.start_time="{ item }">
        {{ formatDate(item.start_time) }}
      </template>

      <template v-slot:item.trainer="{ item }">
        {{ item.trainer_full_name || 'N/A' }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip :color="statusColor(item.status)" class="text-center">
          {{ item.status }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import moment from 'moment'
import { ClassService } from '@/_services/api/admin/class.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

const searchQuery = ref('')
const filteredClasses = ref([])
const snackbar = useSnackbarStore()

const headers = ref([
  { title: 'Class Name', key: 'class_name' },
  { title: 'Trainer', key: 'trainer' },
  { title: 'Start Time', key: 'start_time' },
  { title: 'Duration', key: 'duration_mins' },
  { title: 'Status', key: 'status' },
])

const fetchClasses = async () => {
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

const debouncedFetchClasses = debounce(fetchClasses, 500)

const formatDate = (date: any) => moment(date).format('YYYY-MM-DD HH:mm A')

const statusColor = (status: string) => {
  return status === 'upcoming' ? 'green' : status === 'completed' ? 'blue' : 'red'
}

onMounted(fetchClasses)
</script>

<style lang="scss">
.search-input {
  height: 50px !important;
  flex: unset !important;
}
</style>
