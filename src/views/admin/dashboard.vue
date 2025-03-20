<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-6">Admin Dashboard</h1>

    <!-- Overview Cards Section -->
    <v-row>
      <v-col v-for="(value, key) in stats" :key="key" cols="12" md="3">
        <v-card class="info-card">
          <v-card-title>
            <v-icon :color="getColor(key)" size="32">{{ getIcon(key) }}</v-icon>
            {{ getTitle(key) }}
          </v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            {{ key === 'totalPayments' ? '$' + value : value }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payments Chart -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card>
          <v-card-title>Payments Overview</v-card-title>
          <v-divider></v-divider>
          <div class="chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import { DashboardService } from '@/_services/api/admin/dashboard.service'

// Data placeholders
const stats = ref({
  users: 0,
  classes: 0,
  blogs: 0,
  totalPayments: 0,
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Fetch Data and Initialize Chart
const fetchStats = async () => {
  try {
    const response = await DashboardService.getStats()
    stats.value = response.data

    const paymentResponse = await DashboardService.getPaymentBreakdown()
    createChart(paymentResponse.data)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// Create Chart
const createChart = (paymentData: any) => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const credit_card = paymentData.find((x: any) => x._id === 'credit_card')
  const paypal = paymentData.find((x: any) => x._id === 'paypal')
  const stripe = paymentData.find((x: any) => x._id === 'stripe')

  if (chartCanvas.value) {
    const data = {
      labels: ['Credit Card', 'PayPal', 'Stripe'],
      datasets: [
        {
          label: 'Payments ($)',
          backgroundColor: ['#1976D2', '#4CAF50', '#FF9800'],
          data: [credit_card?.total || 0, paypal?.total || 0, stripe?.total || 0],
        },
      ],
    }

    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }
}

// Cleanup on Unmount
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

onMounted(fetchStats)

// Helper Functions
const getColor = (key: string) =>
  ({
    users: 'blue',
    classes: 'green',
    blogs: 'orange',
    totalPayments: 'purple',
  })[key]

const getIcon = (key: string) =>
  ({
    users: 'mdi-account-group',
    classes: 'mdi-dumbbell',
    blogs: 'mdi-post-outline',
    totalPayments: 'mdi-currency-usd',
  })[key]

const getTitle = (key: string) =>
  ({
    users: 'Users',
    classes: 'Classes',
    blogs: 'Blog Posts',
    totalPayments: 'Total Payments',
  })[key]
</script>

<style scoped>
.info-card {
  text-align: center;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style>
