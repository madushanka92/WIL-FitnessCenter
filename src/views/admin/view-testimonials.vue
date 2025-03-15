<template>
  <div>
    <!-- Search Bar & Role Filter -->
    <div class="d-flex mb-4">
      <v-text-field v-model="searchQuery" label="Search Testimonials By User" class="mr-4" />
      <v-select
        v-model="selectedStatus"
        :items="statusOptions"
        label="Filter by Status"
        class="status-filter"
      />
    </div>

    <!-- Testimonials Table -->
    <v-data-table :headers="headers" :items="filteredTestimonials">
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-end">
          <!-- <v-icon @click="openEditDialog(item)" class="mr-2">mdi-pencil</v-icon> -->
          <v-icon @click="confirmDelete(item)" color="red" class="mr-2">mdi-delete</v-icon>
          <v-icon @click="confirmApprove(item)" color="blue">mdi-check-decagram-outline</v-icon>
        </div>
      </template>
      <template v-slot:item.status="{ item }">
        <div :class="['status-badge', { approved: item.isApproved, pending: !item.isApproved }]">
          <v-icon v-if="item.isApproved" color="green">mdi-check-circle-outline</v-icon>
          <v-icon v-if="!item.isApproved" color="orange">mdi-clock-outline</v-icon>
          <span v-if="item.isApproved">Approved</span>
          <span v-if="!item.isApproved">Pending</span>
        </div>
      </template>
      <template v-slot:item.rating="{ item }">
        <!-- Display rating as stars -->
        <div>
          <v-icon v-for="star in 5" :key="star" :color="star <= item.rating ? 'yellow' : 'grey'"
            >mdi-star</v-icon
          >
        </div>
      </template>
      <!-- Display Full Name -->
      <template v-slot:item.fullName="{ item }">
        {{ item.user.first_name }} {{ item.user.last_name }}
      </template>
    </v-data-table>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this testimonial?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteTestimonial">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Approval Confirmation Dialog -->
    <v-dialog v-model="approveDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Approval</v-card-title>
        <v-card-text>Are you sure you want to approve this testimonial?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="approveDialog = false">Cancel</v-btn>
          <v-btn color="green" @click="approveTestimonial">Approve</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Testimonial Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Edit Testimonial</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedTestimonial.title" label="Title" />
          <v-textarea v-model="editedTestimonial.content" label="Content" rows="4" />
          <v-slider v-model="editedTestimonial.rating" label="Rating" min="1" max="5" step="1" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="blue" @click="updateTestimonial">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

const searchQuery = ref('')
const selectedStatus = ref('All') // Default to show all testimonials
const testimonials = ref([])
const deleteDialog = ref(false)
const editDialog = ref(false)
const approveDialog = ref(false) // Dialog for approval
const testimonialToDelete = ref(null)
const testimonialToEdit = ref(null)
const testimonialToApprove = ref(null) // Store testimonial to approve
const editedTestimonial = ref({ title: '', content: '', rating: 1 })
const snackbar = useSnackbarStore()

const statusOptions = ['All', 'Approved', 'Pending'] // Dropdown options for status
const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Name', key: 'fullName' }, // Display full name
  { title: 'Content', key: 'content' },
  { title: 'Rating', key: 'rating' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

// Computed to filter testimonials based on search query and selected status
const filteredTestimonials = computed(() => {
  return testimonials.value.filter((testimonial) => {
    const fullName = `${testimonial.user.first_name} ${testimonial.user.last_name}`.toLowerCase()

    const matchesSearch = fullName.includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      selectedStatus.value === 'All' ||
      (selectedStatus.value === 'Approved' && testimonial.isApproved) ||
      (selectedStatus.value === 'Pending' && !testimonial.isApproved)

    return matchesSearch && matchesStatus
  })
})

onMounted(fetchTestimonials)
watch([searchQuery, selectedStatus], fetchTestimonials)

// Fetch all testimonials
async function fetchTestimonials() {
  try {
    const { data } = await axios.get('/manageTestimonials/displayTestimonials', {
      params: { search: searchQuery.value },
    })

    testimonials.value = data.testimonials
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch testimonials')
  }
}

// Open the edit dialog with the testimonial to edit
const openEditDialog = (testimonial) => {
  testimonialToEdit.value = testimonial
  editedTestimonial.value = { ...testimonial } // Deep copy the testimonial
  editDialog.value = true
}

// Update the testimonial
const updateTestimonial = async () => {
  try {
    await axios.put(`/manageTestimonials/${testimonialToEdit.value._id}`, editedTestimonial.value)
    snackbar.showSuccess('Testimonial updated successfully')
    editDialog.value = false
    fetchTestimonials()
  } catch (error) {
    snackbar.handleError(error, 'Failed to update testimonial')
  }
}

// Confirm delete testimonial
const confirmDelete = (testimonial) => {
  testimonialToDelete.value = testimonial._id
  deleteDialog.value = true
}

// Delete testimonial
const deleteTestimonial = async () => {
  try {
    await axios.delete(`/manageTestimonials/${testimonialToDelete.value}`)
    snackbar.showSuccess('Testimonial deleted successfully')
    deleteDialog.value = false
    fetchTestimonials()
  } catch (error) {
    snackbar.handleError(error, 'Failed to delete testimonial')
  }
}

// Confirm approve testimonial
const confirmApprove = (testimonial) => {
  testimonialToApprove.value = testimonial // Store testimonial to approve
  approveDialog.value = true
}

// Approve testimonial
const approveTestimonial = async () => {
  try {
    await axios.patch(`/manageTestimonials/${testimonialToApprove.value._id}/approve`)
    snackbar.showSuccess('Testimonial approved successfully')
    approveDialog.value = false
    fetchTestimonials()
  } catch (error) {
    snackbar.handleError(error, 'Failed to approve testimonial')
  }
}
</script>

<style scoped>
.status-filter {
  width: 200px;
}

.d-flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.status-badge {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
  color: black;
  font-size: 14px;
  text-transform: capitalize;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #7ce094;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #efd278;
}

.status-badge v-icon {
  margin-right: 5px;
}
</style>
