<template>
  <div class="membership-container">
    <v-container>
      <v-row class="justify-center">
        <v-col
          v-for="membership in filteredMemberships"
          :key="membership._id"
          cols="12"
          md="4"
          class="d-flex align-stretch"
        >
          <v-card class="membership-card" :class="getCardColor(membership.membership_name)">
            <v-card-title class="text-h5 font-weight-bold text-center">
              {{ capitalizeWords(membership.membership_name) }}
            </v-card-title>
            <v-card-subtitle class="text-center text-h6">
              <strong>${{ formatPrice(membership.price) }}</strong> /
              {{ membership.duration_days }} days
            </v-card-subtitle>
            <v-card-text class="text-center">
              <p class="membership-description">{{ membership.membership_description }}</p>
              <v-chip color="primary" class="mt-2"
                >Max Classes: {{ membership.max_classes_per_week }}</v-chip
              >
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="primary" variant="flat" @click="SelectMembership(membership)"
                >Choose Plan</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Payment Modal -->
    <v-dialog v-model="showPaymentModal" max-width="500px">
      <v-card>
        <v-card-title>Complete Your Payment</v-card-title>
        <v-card-text>
          <div ref="cardElement" class="stripe-card"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" @click="handlePayment">Pay Now</v-btn>
          <v-btn color="secondary" @click="showPaymentModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { MembershipService } from '@/_services/api/user/membership.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { useUserAuthStore } from '@/stores/auth.module'
import { useRouter } from 'vue-router'
import { loadStripe, StripeElements, Stripe } from '@stripe/stripe-js'
import { PaymentService } from '@/_services/api/user/payment.service'
import { nextTick } from 'process'

const filteredMemberships = ref([] as any)
const snackbar = useSnackbarStore()
const userAuth = useUserAuthStore()
const router = useRouter()
const showPaymentModal = ref(false)
const stripeKey =
  'pk_test_51Qzo3tRAUpFKKzR0Rvx02BDNy9pZqDyJFhLGiThHWuDSWkxBQjD0ZZL0HHyd41M0mF75RtaLid9h3TmqSvAiKIZ600rRh4Kazj'
const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const cardElement = ref(null)
const loading = ref(false)
const amount = ref(0)

const fetchMemberships = async () => {
  try {
    const { data } = await MembershipService.getAllMemberships()
    filteredMemberships.value = data.data
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch memberships')
  }
}

const formatPrice = (price: any) => parseFloat(price.$numberDecimal.toString()).toFixed(2)

const getCardColor = (name: string) => {
  if (name.toLowerCase().includes('premium')) return 'premium-card'
  if (name.toLowerCase().includes('basic')) return 'basic-card'
  return 'standard-card'
}

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

onMounted(async () => {
  fetchMemberships()
  setTimeout(async () => {
    stripe.value = await loadStripe(stripeKey)
  }, 1000)
})

const SelectMembership = (membership: any) => {
  console.log('A > ', membership)
  if (userAuth.getIsAuthenticated) {
    amount.value = membership.price.$numberDecimal
    showPaymentModal.value = true // Show payment modal
    nextTick(() => {
      elements.value = stripe.value ? stripe.value.elements() : null
      if (elements.value && cardElement.value) {
        const card = elements.value.create('card', {
          style: {
            base: {
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
          hidePostalCode: true, // Hide the postal code input
        })
        card.mount(cardElement.value)
      }
    })
  } else {
    router.push('/login')
  }
}

const handlePayment = async () => {
  loading.value = true
  try {
    const { data } = await PaymentService.createPayment({
      amount: amount.value,
      currency: 'cad',
    })

    const clientSecret = data.clientSecret

    if (!stripe.value || !elements.value) return

    const { paymentIntent, error } = await stripe.value.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.value.getElement('card')! },
    })

    if (error) {
      snackbar.handleError(error, error.message)
    } else if (paymentIntent.status === 'succeeded') {
      snackbar.showSuccess('Payment successful !')
      showPaymentModal.value = false // Close modal after success
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.membership-container {
  min-height: 50vh;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.membership-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.premium-card {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
}

.basic-card {
  background: linear-gradient(135deg, #03a9f4, #0288d1);
  color: white;
}

.standard-card {
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
}

.membership-description {
  font-size: 14px;
  opacity: 0.9;
}

.stripe-card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>
