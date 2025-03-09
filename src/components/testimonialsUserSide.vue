<template>
  <v-container>
    <!-- Testimonial Section -->
    <v-row justify="center" class="text-center my-10">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">What Our Members Say</h1>
        <p class="text-h6">Real stories from our fitness community</p>
      </v-col>
    </v-row>

    <!-- Automatic Testimonial Carousel -->
    <v-carousel cycle hide-delimiters show-arrows interval="3000">
      <v-carousel-item v-for="(testimonial, index) in testimonials" :key="index">
        <v-card class="testimonial-card">
          <v-card-text>
            <v-avatar size="80" class="mb-4">
              <v-img src="https://avatar.iran.liara.run/public/boy" alt="User Avatar"></v-img>
            </v-avatar>
            <blockquote>
              <p class="text-h6 font-italic">{{ testimonial.content }}</p>
              <footer class="text-subtitle-1 mt-3">
                — {{ testimonial.user?.first_name }} {{ testimonial.user?.last_name }}
              </footer>
            </blockquote>
            <!-- Display Rating as Stars -->
            <div class="rating">
              <v-icon
                v-for="star in 5"
                :key="star"
                :color="star <= testimonial.rating ? 'yellow' : 'grey'"
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

const fetchTestimonials = async () => {
  try {
    const response = await axios.get('/testimonials/view-testimonial') // Adjust the API URL if needed
    testimonials.value = response.data.testimonials
  } catch (error) {
    console.error('Error fetching testimonials:', error)
  }
}

onMounted(fetchTestimonials)
</script>

<style scoped>
.testimonial-card {
  max-width: 500px;
  margin: auto;
  padding: 30px;
  border-radius: 12px;
  background: #f5f5f5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.rating {
  margin-top: 10px;
}
</style>
