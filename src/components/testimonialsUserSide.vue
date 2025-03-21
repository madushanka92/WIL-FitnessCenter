<template>
  <v-container>
    <!-- Testimonial Section -->
    <v-row justify="center" class="text-center my-10">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold text-primary">What Our Members Say</h1>
        <p class="text-h6">Real stories from our fitness community</p>
      </v-col>
    </v-row>

    <!-- Testimonial Carousel with Enhanced UI -->
    <v-carousel
      cycle
      hide-delimiters
      show-arrows-on-hover
      interval="4000"
      height="350"
      class="testimonial-carousel"
    >
      <v-carousel-item v-for="(testimonial, index) in testimonials" :key="index">
        <v-card class="testimonial-card">
          <v-card-text>
            <!-- Avatar Section -->
            <v-avatar size="90" class="mb-4">
              <v-img :src="testimonial.user?.avatar || defaultAvatar" alt="User Avatar"></v-img>
            </v-avatar>

            <!-- Testimonial Content -->
            <blockquote>
              <p class="text-h6 font-italic text-secondary">"{{ testimonial.content }}"</p>
              <footer class="text-subtitle-1 mt-3 text-grey-darken-1">
                — {{ testimonial.user?.first_name }} {{ testimonial.user?.last_name }}
              </footer>
            </blockquote>

            <!-- Rating Display -->
            <div class="rating">
              <v-icon
                v-for="star in 5"
                :key="star"
                :color="star <= testimonial.rating ? 'yellow darken-2' : 'grey lighten-1'"
                size="28"
              >
                mdi-star
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const testimonials = ref([])
const defaultAvatar = 'https://avatar.iran.liara.run/public/boy' // Placeholder for missing avatars

const fetchTestimonials = async () => {
  try {
    const response = await axios.get('/testimonials/view-testimonial') // Adjust API if needed
    testimonials.value = response.data.testimonials
  } catch (error) {
    console.error('Error fetching testimonials:', error)
  }
}

onMounted(fetchTestimonials)
</script>

<style scoped>
/* Improved Testimonial Card */
.testimonial-card {
  max-width: 600px;
  margin: auto;
  padding: 40px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  animation: fade-in 0.5s ease-in-out;
}

/* Testimonial Carousel */
.testimonial-carousel {
  margin-top: 40px;
}

/* Rating Style */
.rating {
  margin-top: 12px;
}

/* Animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Colors */
.text-primary {
  color: #1976d2;
}

.text-secondary {
  color: #0288d1;
}
</style>
