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
          <v-card
            class="membership-card"
            :class="[
              getCardColor(membership.membership_name),
              membershipID === membership._id ? 'active-membership' : '',
            ]"
          >
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
              <v-btn
                color="primary"
                variant="flat"
                @click="SelectMembership(membership)"
                :disabled="membershipID || membershipID === membership._id ? true : false"
              >
                {{ membershipID === membership._id ? 'Active Membership' : 'Choose Plan' }}
              </v-btn>
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
          <v-text-field
            v-model="discountCode"
            label="Enter Discount Code"
            outlined
            dense
            clearable
            @blur="applyDiscount"
          ></v-text-field>
          <p v-if="discountAmount > 0" class="discount-text">
            <span>
              Discount Applied: <strong>${{ discountAmount }}</strong></span
            >

            <span
              >Total : <strong>${{ getTotalPayment(amount, discountAmount) }}</strong></span
            >
          </p>
          <div ref="cardElement" class="stripe-card"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" @click="handlePayment">Pay Now</v-btn>
          <v-btn color="secondary" @click="showPaymentModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DisplayDiscounts />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { MembershipService } from '@/_services/api/user/membership.service'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { useUserAuthStore } from '@/stores/auth.module'
import { useRouter } from 'vue-router'
import { loadStripe, StripeElements, Stripe } from '@stripe/stripe-js'
import { PaymentService } from '@/_services/api/user/payment.service'
import { nextTick } from 'process'
import { UserService } from '@/_services/api/user/user.service'
import { getUserID, getUserMembership } from '@/_services/helpers/helpers'
import { useUiStore } from '@/stores/ui.module'
import DisplayDiscounts from '../../components/DisplayDiscounts.vue'

const filteredMemberships = ref([] as any)
const snackbar = useSnackbarStore()
const userAuth = useUserAuthStore()
const router = useRouter()

const uiStore = useUiStore()
const showPaymentModal = ref(false)
const stripeKey =
  'pk_test_51Qzo3tRAUpFKKzR0Rvx02BDNy9pZqDyJFhLGiThHWuDSWkxBQjD0ZZL0HHyd41M0mF75RtaLid9h3TmqSvAiKIZ600rRh4Kazj'
const stripe = ref<Stripe | null>(null)
const elements = ref<StripeElements | null>(null)
const cardElement = ref(null)
const loading = ref(false)
const amount = ref(0)
const selectedMembership = ref(null)
const discountCode = ref('')
const discountAmount = ref(0) as any

const fetchMemberships = async () => {
  try {
    const { data } = await MembershipService.getAllMemberships()
    filteredMemberships.value = data.data
  } catch (error) {
    snackbar.handleError(error, 'Failed to fetch memberships')
  }
}

const membershipID = ref(getUserMembership())

const formatPrice = (price: any) => parseFloat(price?.$numberDecimal?.toString()).toFixed(2)

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
  discountAmount.value = 0
  selectedMembership.value = membership._id
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

  uiStore.setShowOverLay(true)
  try {
    const { data } = await PaymentService.createPayment({
      amount: amount.value,
      discountCode: discountCode.value,
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

      const membershipPaymnet = await PaymentService.updateMembershipPayment({
        membership_id: selectedMembership.value,
        amount: paymentIntent.amount / 100,
        payment_method: 'stripe',
        transaction_id: paymentIntent.id,
        discountCode: discountCode.value,
        amountBeforeDiscount: amount.value,
      })

      if (membershipPaymnet?.data?.success) {
        await userAuth.refreshToken()
        nextTick(() => {
          membershipID.value = selectedMembership.value
        })
      }
    }
  } catch (error) {
    uiStore.setShowOverLay(false)
    snackbar.handleError(error, 'Payment Failed')
  } finally {
    uiStore.setShowOverLay(false)
    loading.value = false
  }
}

const applyDiscount = async () => {
  if (!discountCode.value) {
    discountAmount.value = 0
    return
  }

  try {
    const { data } = await UserService.validateDiscount({ promo_code: discountCode.value })
    if (data.success && data.promotion) {
      const percentage = data.promotion.percentage

      discountAmount.value = Math.floor(amount.value * (parseFloat(percentage) / 100) * 100) / 100

      snackbar.showSuccess(`Discount Applied: $${discountAmount.value}`)
    } else {
      discountAmount.value = 0
      snackbar.handleError(null, 'Invalid Discount Code')
    }
  } catch (error) {
    snackbar.handleError(error, 'Failed to validate discount')
  }
}

const getTotalPayment = (amount: any, discount: any) => {
  return (Math.floor((parseFloat(amount) - parseFloat(discount)) * 100) / 100).toFixed(2)
}
</script>

<style lang="scss" scoped>
.stripe-card {
  padding: 12px;
  border: 1px solid #205d0f;
}

.discount-text {
  padding-bottom: 20px;

  display: flex;
  flex-direction: column;

  > span {
    display: flex;
    justify-content: space-between;
  }
}
.membership-container {
  height: 100%;
  min-height: 50vh;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

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

  .active-membership {
    border: 3px solid #ffd700; // Gold border for active membership
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
    position: relative;
  }

  .active-membership::before {
    content: 'Active';
    position: absolute;
    top: -10px;
    right: 10px;
    background: #ffd700;
    color: #000;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 5px;
  }
}
</style>
