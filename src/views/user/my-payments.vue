<template>
  <v-container>
    <!-- Membership Banner -->
    <v-alert v-if="membership" type="info" class="mb-4 text-center" prominent>
      <strong>Membership:</strong> {{ capitalizeWords(membership.membership_name) }} |
      <strong>Expires on:</strong>
      {{ formatDate(membership.expires_at) }}
    </v-alert>

    <h2 class="text-center my-4">My Payments</h2>
    <v-data-table
      :items="payments"
      :headers="[
        { title: 'Transaction ID', key: 'transaction_id' },
        { title: 'Amount', key: 'amount' },
        { title: 'Payment Method', key: 'payment_method' },
        { title: 'Status', key: 'payment_status' },
        { title: 'Date', key: 'created_at' },
        { title: 'Invoice', key: 'actions', sortable: false },
      ]"
    >
      <!-- Format Amount as Currency -->
      <template v-slot:item.amount="{ item }">
        {{ formatCurrency(item.amount.$numberDecimal) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="primary" @click="downloadInvoice(item)">Download PDF</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { VDataTable } from 'vuetify/components/VDataTable'
import { PaymentService } from '@/_services/api/user/payment.service'
import { MembershipService } from '@/_services/api/user/membership.service'

// Payment type
interface Payment {
  user_id: any
  _id: string
  amount: number
  payment_method: string
  payment_status: string
  transaction_id: string | null
  created_at: string
}

interface Membership {
  membership_name: string
  expires_at: string
}

// State
const payments = ref<Payment[]>([])
const membership = ref<Membership | null>(null)

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(value)
}

// Fetch payments
const fetchPayments = async () => {
  try {
    const response = await PaymentService.getPaymentsForUser()
    payments.value = response.data
  } catch (error) {
    console.error('Failed to fetch payments', error)
  }
}

const fetchMembership = async () => {
  try {
    const res = await MembershipService.getMemberShipInfo()
    membership.value = res.data
  } catch (error) {}
}

// Generate Invoice PDF
const downloadInvoice = (payment: Payment) => {
  const doc = new jsPDF()
  const companyName = 'Starfinder Solutions'
  const companyAddress = '123 Main Street, Mississauga, ON'
  const companyPhone = '(123) 456-7890'

  // Set background color for the title
  doc.setFillColor(41, 128, 185) // Blue background
  doc.rect(0, 0, 210, 30, 'F') // Rectangle (F=fill)

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255) // White text
  doc.setFontSize(20)
  doc.text('INVOICE', 90, 20)

  // Company Information
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(companyName, 20, 40)
  doc.text(companyAddress, 20, 48)
  doc.text(companyPhone, 20, 56)

  // Invoice Details
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice To:', 20, 70)
  doc.setFont('helvetica', 'normal')
  doc.text(`User : ${payment.user_id.first_name} ${payment.user_id.last_name}`, 20, 78)

  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Details:', 20, 90)
  doc.setFont('helvetica', 'normal')
  doc.text(`Transaction ID: ${payment.transaction_id || 'N/A'}`, 20, 98)
  doc.text(`Amount: $${payment.amount.$numberDecimal}`, 20, 106)
  doc.text(`Payment Method: ${payment.payment_method}`, 20, 114)
  doc.text(`Payment Status: ${payment.payment_status}`, 20, 122)
  doc.text(`Date: ${new Date(payment.created_at).toLocaleDateString()}`, 20, 130)

  // Table for better layout
  autoTable(doc, {
    startY: 140, // Make sure to provide a valid Y position
    head: [['Description', 'Amount']],
    body: [['Membership Fee', `$${payment.amount.$numberDecimal}`]],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Blue Header
    styles: { fontSize: 12 },
  })

  // Thank You Note
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100, 100, 100)
  doc.text('Thank you for your payment!', 20, doc.lastAutoTable.finalY + 10)

  // Save the PDF
  doc.save(`Invoice_${payment._id}.pdf`)
}

// Fetch data when the component mounts
onMounted(() => {
  fetchPayments()
  fetchMembership()
})

// Format date
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style lang="scss">
.v-btn {
  text-transform: none;
}
</style>
