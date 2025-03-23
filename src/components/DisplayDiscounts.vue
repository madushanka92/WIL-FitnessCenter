<template>
  <v-container>
    <!-- Section Title -->
    <v-row justify="center" class="text-center my-10">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">🎉 Exclusive Discounts</h1>
        <p class="text-h6 text-grey-darken-1">
          Save big on your membership plans with these amazing deals!
        </p>
      </v-col>
    </v-row>

    <!-- Discounts Grid -->
    <v-row justify="center">
      <v-col
        v-if="discounts.length > 0"
        v-for="(discount, index) in discounts"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="discount-card">
          <v-card-title class="discount-title">
            {{ discount.name }}
          </v-card-title>
          <v-card-subtitle class="discount-subtitle">
            {{ discount.description }}
          </v-card-subtitle>

          <v-card-text class="discount-content">
            <v-chip class="discount-badge"> {{ discount.percentage }}% OFF </v-chip>

            <div class="promo-code">
              <span>Use code:</span>
              <strong>{{ discount.promo_code }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- No Discounts Available -->
      <v-col v-else class="text-center">
        <v-alert type="info" outlined class="mt-4">
          No discounts available at the moment. Stay tuned for upcoming deals!
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DiscountService } from '@/_services/api/user/discount.service'

const discounts = ref([])

const fetchDiscounts = async () => {
  try {
    const response = await DiscountService.getAllDiscounts()
    discounts.value = response.data.promotions.filter((x: any) => x.isActive)
  } catch (error) {
    console.error('Error fetching discounts:', error)
  }
}

onMounted(() => {
  fetchDiscounts()
})
</script>

<style scoped>
/* Styling for uniform discount cards */
.discount-card {
  height: 220px;
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6f61, #ff9068);
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.discount-card:hover {
  transform: translateY(-5px);
}

/* Title & Subtitle */
.discount-title {
  font-size: 1.4rem;
  font-weight: bold;
}

.discount-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Discount Percentage Badge */
.discount-badge {
  font-size: 1.2rem;
  padding: 6px 14px;
  margin-bottom: 12px;
  border-radius: 8px;
  background: white;
  color: #ff6f61;
  font-weight: bold;
}

/* Promo Code */
.promo-code {
  font-size: 1.1rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 6px;
  display: inline-block;
}

.discount-content {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
