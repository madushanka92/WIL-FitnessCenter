<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-6">Manage Memberships</h1>

    <!-- Add Membership Button -->
    <v-btn color="primary" @click="openDialog()">Add Membership</v-btn>

    <!-- Memberships Table -->
    <v-data-table
      :headers="headers"
      :items="memberships"
      class="mt-6"
      density="comfortable"
      loading-text="Loading memberships..."
      :loading="loading"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" color="blue" @click="openDialog(item)"></v-btn>
        <v-btn icon="mdi-delete" color="red" @click="confirmDelete(item._id)"></v-btn>
      </template>

      <template v-slot:item.membership_name="{ item }">
        {{ capitalizeWords(item.membership_name) }}
      </template>

      <!-- Format Amount as Currency -->
      <template v-slot:item.price="{ item }">
        {{ formatCurrency(item.price.$numberDecimal) }}
      </template>
    </v-data-table>

    <!-- Dialog for Create/Edit Membership -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ form._id ? 'Edit Membership' : 'Add Membership' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <v-text-field
              v-model="form.membership_name"
              label="Membership Name"
              :rules="[rules.required]"
            />
            <v-text-field
              v-model="form.price"
              label="Price ($)"
              type="number"
              :rules="[rules.required, rules.positive]"
            />
            <v-textarea
              v-model="form.membership_description"
              label="Description"
              :rules="[rules.required]"
            />
            <v-text-field
              v-model="form.duration_days"
              label="Duration (Days)"
              type="number"
              :rules="[rules.required, rules.positive]"
            />
            <v-text-field
              v-model="form.max_classes_per_week"
              label="Max Classes/Week"
              type="number"
              :rules="[rules.required, rules.nonNegative]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveMembership" :disabled="!valid">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this membership?</v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteMembership">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MembershipService } from '@/_services/api/admin/membership.service'
import { VForm } from 'vuetify/components'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

interface Membership {
  _id?: string
  membership_name: string
  price: number
  membership_description: string
  duration_days: number
  max_classes_per_week: number
}

const memberships = ref<Membership[]>([])
const loading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const deleteDialog = ref<boolean>(false)
const form = ref<Membership>(getDefaultForm())
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const valid = ref<boolean>(true)
const deleteId = ref<string | null>(null)
const snackbar = useSnackbarStore()

// Table Headers
const headers = [
  { title: 'Membership Name', key: 'membership_name' },
  { title: 'Price ($)', key: 'price' },
  { title: 'Duration (Days)', key: 'duration_days' },
  { title: 'Max Classes/Week', key: 'max_classes_per_week' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(value)
}

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

// Fetch Memberships
const fetchMemberships = async () => {
  loading.value = true
  try {
    const response = await MembershipService.getAll()
    memberships.value = response.data.data
  } catch (error) {
    console.error('Error fetching memberships:', error)
  } finally {
    loading.value = false
  }
}

// Open Dialog for Create/Edit
const openDialog = (membership?: Membership) => {
  form.value = membership ? { ...membership } : getDefaultForm()
  if (membership) form.value.price = membership.price.$numberDecimal
  dialog.value = true
}

// Save Membership (Create or Update)
const saveMembership = async () => {
  if (formRef.value) {
    const isValid = await formRef.value.validate()
    if (!isValid) return

    try {
      if (form.value._id) {
        await MembershipService.update(form.value._id, form.value)
      } else {
        await MembershipService.create(form.value)
      }
      fetchMemberships()
      dialog.value = false
    } catch (error) {
      console.error('Error saving membership:', error)
      snackbar.handleError(error, 'Error saving membership')
    }
  }
}

// Confirm Delete
const confirmDelete = (id: string) => {
  deleteId.value = id
  deleteDialog.value = true
}

// Delete Membership
const deleteMembership = async () => {
  if (deleteId.value) {
    try {
      await MembershipService.delete(deleteId.value)
      fetchMemberships()
      deleteDialog.value = false
    } catch (error) {
      console.error('Error deleting membership:', error)
      snackbar.handleError(error, 'Error deleting membership')
    }
  }
}

// Form Defaults
function getDefaultForm(): Membership {
  return {
    membership_name: '',
    price: 0,
    membership_description: '',
    duration_days: 1,
    max_classes_per_week: 0,
  }
}

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'Required',
  positive: (value: any) => value > 0 || 'Must be a positive number',
  nonNegative: (value: any) => value >= 0 || 'Cannot be negative',
}

onMounted(fetchMemberships)
</script>
