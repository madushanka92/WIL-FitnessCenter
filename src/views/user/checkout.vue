<template>
  <div class="checkout-container">
    <v-card class="checkout-card">
      <v-card-title>Complete Your Payment</v-card-title>
      <v-card-text>
        <div ref="cardElement" class="stripe-card"></div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :loading="loading" @click="handlePayment">Pay Now</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { loadStripe, StripeElements, Stripe } from '@stripe/stripe-js'
import axios from 'axios'
import { PaymentService } from '@/_services/api/user/payment.service'

const stripeKey =
  'pk_test_51Qzo3tRAUpFKKzR0Rvx02BDNy9pZqDyJFhLGiThHWuDSWkxBQjD0ZZL0HHyd41M0mF75RtaLid9h3TmqSvAiKIZ600rRh4Kazj'
const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const cardElement = ref(null)
const loading = ref(false)

onMounted(async () => {
  stripe.value = await loadStripe(stripeKey)
  elements.value = stripe.value?.elements()
  if (elements.value) {
    const card = elements.value.create('card')
    card.mount(cardElement.value)
  }
})

const handlePayment = async () => {
  loading.value = true
  try {
    const { data } = await PaymentService.createPayment({
      amount: 29.99, // Amount in cents (e.g., $20.00)
      currency: 'cad',
    })

    const clientSecret = data.clientSecret

    if (!stripe.value || !elements.value) return

    const { paymentIntent, error } = await stripe.value.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.value.getElement('card')! },
    })

    if (error) {
      alert(error.message)
    } else if (paymentIntent.status === 'succeeded') {
      alert('Payment successful!')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.checkout-card {
  padding: 16px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.stripe-card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>
