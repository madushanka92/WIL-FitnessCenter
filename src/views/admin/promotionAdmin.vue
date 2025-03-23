<template>
  <div>
    <!-- Search Bar -->
    <div class="d-flex mb-4">
      <v-text-field v-model="searchQuery" label="Search Promotions" class="mr-4" />
    </div>

    <!-- Promotions Table -->
    <v-data-table :headers="headers" :items="filteredPromotions">
      <template v-slot:item.isActive="{ item }">
        <v-btn :color="item.isActive ? 'green' : 'red'" @click="toggleStatus(item)">
          {{ item.isActive ? 'Active' : 'Inactive' }}
        </v-btn>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon @click="openEditDialog(item)" class="mr-2">mdi-pencil</v-icon>
        <v-icon @click="confirmDelete(item)" color="red">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this promotion?</v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deletePromotion">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add/Edit Promotion Dialog -->
    <v-dialog v-model="editDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">{{
          isEditing ? 'Edit Promotion' : 'Generate Promotion'
        }}</v-card-title>
        <v-card-text>
          <v-form ref="promoFormRef">
            <v-text-field
              v-model="percentage"
              label="Discount (%)"
              type="number"
              :min="1"
              :max="99.99"
              :rules="[rules.required, rules.minValue, rules.maxValue]"
            />
            <v-text-field
              v-model="expiryDate"
              label="Expiry Date"
              type="date"
              :min="minDate"
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="blue" @click="isEditing ? updatePromotion() : createPromotion()">
            {{ isEditing ? 'Update' : 'Generate' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Buttons for Generating Promotions -->
    <div class="button-group">
      <v-btn color="purple" class="mt-4" @click="openGenerateDialog">Generate Promotion</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PromotionService } from '@/_services/api/admin/promotion.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { useUiStore } from '@/stores/ui.module'

const searchQuery = ref('')
const promotions = ref([])
const deleteDialog = ref(false)
const editDialog = ref(false)
const isEditing = ref(false)
const promotionToDelete = ref(null)
const promoCode = ref('')
const percentage = ref('')
const expiryDate = ref('')
const promoId = ref(null)
const snackbar = useSnackbarStore()
const promoFormRef = ref<any>(null)

const uiStore = useUiStore()

const rules = {
  required: (value: any) => !!value || 'This field is required',
  minValue: (value: any) => (value !== null && value >= 1) || 'Discount must be at least 1%',
  maxValue: (value: any) => (value !== null && value <= 99.99) || 'Discount must be below 100%',
}

const minDate = ref('')

const setMinDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  minDate.value = tomorrow.toISOString().split('T')[0]
}

setMinDate()

const headers = [
  { title: 'Promo Code', key: 'promo_code' },
  { title: 'Discount (%)', key: 'percentage' },
  { title: 'Expiry Date', key: 'expiryDate' },
  { title: 'Status', key: 'isActive' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

onMounted(fetchPromotions)

const filteredPromotions = computed(() => {
  return promotions.value.filter((promo) =>
    promo.promo_code.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

async function fetchPromotions() {
  try {
    const { data } = await PromotionService.getAllPromotions()

    // Format expiryDate to remove time
    promotions.value = data.promotions.map((promo) => ({
      ...promo,
      expiryDate: promo.expiryDate.split('T')[0], // Extract only YYYY-MM-DD
    }))

    uiStore.setShowOverLay(false)
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch promotions')
    uiStore.setShowOverLay(false)
  }
}

const confirmDelete = (promo) => {
  promotionToDelete.value = promo._id
  deleteDialog.value = true
}

const deletePromotion = async () => {
  deleteDialog.value = false
  if (!promotionToDelete.value) return

  try {
    await PromotionService.deletePromotion(promotionToDelete.value)
    snackbar.showSuccess('Promotion deleted successfully')
    fetchPromotions()
  } catch (error) {
    snackbar.handleError(error, 'Failed to delete promotion')
  }
}

// Open dialog to generate a new promotion
const openGenerateDialog = () => {
  isEditing.value = false
  promoCode.value = `PROMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}` // Auto-generate
  percentage.value = ''
  expiryDate.value = ''
  editDialog.value = true
}

// Create a new promotion
const createPromotion = async () => {
  const { valid } = await promoFormRef.value?.validate()
  if (!valid) return // Stop if validation fails

  if (!percentage.value || !expiryDate.value) {
    snackbar.notify('Please enter discount percentage and expiry date.', 'error')
    return
  }

  uiStore.setShowOverLay(true)

  try {
    await PromotionService.createRandomPromotion(percentage.value, expiryDate.value)
    snackbar.showSuccess('Promotion created successfully')
    editDialog.value = false
    fetchPromotions()
  } catch (error) {
    snackbar.handleError(error, 'Failed to create promotion')

    uiStore.setShowOverLay(false)
  }
}

// Open edit dialog with previous expiry date
const openEditDialog = (promo) => {
  isEditing.value = true
  promoId.value = promo._id
  promoCode.value = promo.promo_code
  percentage.value = promo.percentage

  // Convert expiryDate to YYYY-MM-DD format so it's correctly displayed in the date input
  expiryDate.value = promo.expiryDate.split('T')[0]

  editDialog.value = true
}

// Update an existing promotion
const updatePromotion = async () => {
  const { valid } = await promoFormRef.value?.validate()
  if (!valid) return // Stop if validation fails

  if (!percentage.value || !expiryDate.value) {
    snackbar.notify('All fields are required', 'error')
    return
  }

  uiStore.setShowOverLay(true)
  try {
    await PromotionService.updatePromotion(
      promoId.value,
      promoCode.value,
      percentage.value,
      expiryDate.value,
      true,
    )
    snackbar.showSuccess('Promotion updated successfully')
    editDialog.value = false
    fetchPromotions()
  } catch (error) {
    snackbar.handleError(error, 'Failed to update promotion')
    uiStore.setShowOverLay(false)
  }
}

// Toggle Active/Inactive Status
const toggleStatus = async (promo) => {
  try {
    await PromotionService.updatePromotion(
      promo._id,
      promo.promo_code,
      promo.percentage,
      promo.expiryDate,
      !promo.isActive,
    )
    snackbar.showSuccess(`Promotion ${promo.promo_code} status updated`)
    fetchPromotions()
  } catch (error) {
    snackbar.handleError(error, 'Failed to update status')
  }
}
</script>

<style scoped>
.v-data-table {
  text-align: left;
}
.d-flex {
  display: flex;
  gap: 10px;
}
.button-group {
  display: flex;
  gap: 10px;
}
</style>
