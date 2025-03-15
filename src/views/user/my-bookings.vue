<template>
  <v-container>
    <h2 class="text-h5 mb-4">My Bookings</h2>

    <FullCalendar :options="calendarOptions" />

    <!-- Dialog for Event Details -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Class Details</v-card-title>
        <v-card-text>
          <p><strong>Class Name:</strong> {{ selectedEvent.class_name }}</p>
          <p><strong>Trainer:</strong> {{ selectedEvent.trainer_name }}</p>
          <p><strong>Date:</strong> {{ selectedEvent.date }}</p>
          <p><strong>Time:</strong> {{ selectedEvent.time }}</p>
          <p><strong>Location:</strong> {{ selectedEvent.location }}</p>
          <p><strong>Status:</strong> {{ selectedEvent.status }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="selectedEvent.status === 'canceled' ? 'green' : 'red'"
            @click="confirmCancelBooking"
            v-if="!isUserTrainer"
          >
            {{ selectedEvent.status === 'canceled' ? 'Re-Book' : 'Cancel Booking' }}
          </v-btn>
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ClassBookingService } from '@/_services/api/user/class.booking.service'
import { useUiStore } from '@/stores/ui.module'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { isCurrentUserTrainer } from '@/_services/helpers/helpers'

export default defineComponent({
  name: 'MyBookings',
  components: {
    FullCalendar,
  },
  setup() {
    const router = useRouter()
    const events = ref<any[]>([])
    const selectedEvent = ref<any>(null)
    const dialog = ref(false)
    const uiStore = useUiStore()
    const snackbar = useSnackbarStore()

    const isUserTrainer = computed(() => {
      return isCurrentUserTrainer()
    })

    const fetchBookings = async () => {
      try {
        const response = await ClassBookingService.getAllClassForUser()
        events.value = response.data.bookings.map((booking: any) => ({
          title: booking.class_id.class_name,
          start: new Date(booking.class_id.start_time),
          end: new Date(
            new Date(booking.class_id.start_time).getTime() +
              booking.class_id.duration_mins * 60000,
          ),
          location: booking.class_id.location || 'Fitness Center',
          status: booking.status,
          trainer: `${booking.class_id.trainer_id.user_id.first_name} ${booking.class_id.trainer_id.user_id.last_name}`,
          bookingId: booking._id,
          class_id: booking.class_id._id,
          backgroundColor: booking.status === 'canceled' ? '#f44336' : '#2196F3', // ✅ Set color based on status
          borderColor: booking.status === 'canceled' ? '#f44336' : '#2196F3', // ✅ Set border color as well
        }))
      } catch (error) {
        console.error('Error fetching bookings:', error)
        snackbar.handleError(error, 'Class booking failed !')
      }
    }

    const handleEventClick = (info: any) => {
      selectedEvent.value = {
        class_name: info.event.title,
        trainer_name: info.event.extendedProps.trainer,
        date: info.event.start.toLocaleDateString(),
        time: `${info.event.start.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}`,
        location: info.event.extendedProps.location,
        bookingId: info.event.extendedProps.bookingId,
        class_id: info.event.extendedProps.class_id,
        status: info.event.extendedProps.status,
      }
      dialog.value = true
    }

    const confirmCancelBooking = async () => {
      if (selectedEvent.value.status === 'canceled') {
        dialog.value = true
        bookClass()
      } else
        uiStore.showConfirmation(
          'Cancel Booking',
          'Are you sure you want to cancel this booking?',
          cancelBooking,
        )
    }

    const bookClass = async () => {
      uiStore.setShowOverLay(true)
      try {
        const { data } = await ClassBookingService.bookClass({
          class_id: selectedEvent.value.class_id,
        })
        if (data.success) snackbar.showSuccess('Class booked successfully!')
        nextTick(() => {
          fetchBookings()
        })
      } catch (error) {
        snackbar.handleError(error, 'Class booking failed !')
      } finally {
        dialog.value = true
        uiStore.setShowOverLay(false)
      }
    }

    const cancelBooking = async () => {
      dialog.value = true
      uiStore.setShowOverLay(true)

      try {
        const { data } = await ClassBookingService.cancelClassBooking({
          class_id: selectedEvent.value.class_id,
        })
        if (data.success) snackbar.showSuccess('Class cancelled successfully!')
        nextTick(() => {
          fetchBookings()
        })
      } catch (error) {
        snackbar.handleError(error, 'Class cancel failed !')
      } finally {
        uiStore.setShowOverLay(false)
      }
    }

    onMounted(() => {
      fetchBookings()
    })

    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      events: events,
      eventClick: handleEventClick,
    })

    return {
      events,
      selectedEvent,
      dialog,
      calendarOptions,
      cancelBooking,
      confirmCancelBooking,
      isUserTrainer,
    }
  },
})
</script>
