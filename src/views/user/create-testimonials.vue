<template>
  <div class="testimonial-container">
    <div class="testimonial-card form-card">
      <h2 class="card-title">Submit Your Testimonial</h2>
      <form @submit.prevent="submitTestimonial">
        <div class="form-group">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            id="title"
            v-model="title"
            required
            maxlength="255"
            class="form-input"
            placeholder="Enter a title for your testimonial"
          />
        </div>

        <div class="form-group">
          <label for="content" class="form-label">Your Experience</label>
          <textarea
            id="content"
            v-model="content"
            required
            maxlength="1000"
            class="form-textarea"
            placeholder="Tell us about your experience..."
          ></textarea>
          <span class="char-count">{{ content.length }}/1000</span>
        </div>

        <div class="form-group">
          <label for="rating" class="form-label">Rating</label>
          <div class="rating-select-container">
            <select 
              id="rating" 
              v-model="rating" 
              required 
              class="form-select"
            >
              <option value="" disabled selected>Select your rating</option>
              <option v-for="star in 5" :key="star" :value="star">
                {{ star }} {{ star === 1 ? ' ' : ' ' }}
              </option>
            </select>
            <div class="star-display-preview" v-if="rating">
              <svg v-for="star in 5" :key="star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :class="['preview-star', { 'star-filled': star <= rating }]">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Testimonial</span>
        </button>

        <div v-if="errorMessage" class="message error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="message-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="message success-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="message-icon">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {{ successMessage }}
        </div>
      </form>
    </div>

    <div class="testimonial-card display-card">
      <h2 class="card-title">Your Approved Testimonials</h2>
      <div class="testimonials-list">
        <div v-for="testimonial in approvedTestimonials" :key="testimonial._id" class="testimonial-item">
          <div class="testimonial-header">
            <h3 class="testimonial-title">{{ testimonial.title }}</h3>
            <div class="testimonial-rating">
              <div class="star-display">
                <svg v-for="star in 5" :key="star" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :class="['star-icon', { 'star-filled': star <= testimonial.rating }]">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
          </div>
          <p class="testimonial-content">{{ testimonial.content }}</p>
        </div>
      </div>
      <div v-if="approvedTestimonials.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>No testimonials submitted yet.</p>
        <p class="empty-subtitle">Your approved testimonials will appear here.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getUserID } from "../../_services/helpers/helpers";

export default {
  data() {
    return {
      title: '',
      content: '',
      rating: '',
      errorMessage: '',
      successMessage: '',
      approvedTestimonials: [],
      userId: null,
      isSubmitting: false
    };
  },
  methods: {
    async fetchTestimonials() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/testimonials/view-testimonial', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.userId = getUserID();

        if (this.userId) {
          this.approvedTestimonials = response.data.testimonials.filter(
            (testimonial) => testimonial.user._id === this.userId
          );
        } else {
          console.error('User ID is not available.');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'You need to be logged in to view testimonials.';
        } else {
          console.error('Error fetching testimonials:', error);
        }
      }
    },
    async submitTestimonial() {
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.title || !this.content || !this.rating) {
        this.errorMessage = 'All fields are required.';
        return;
      }

      this.isSubmitting = true;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/testimonials/add-testimonial',
          {
            title: this.title,
            content: this.content,
            rating: this.rating,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          this.successMessage = response.data.message;
          this.resetForm();
          await this.fetchTestimonials();
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Error submitting testimonial.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.title = '';
      this.content = '';
      this.rating = '';
    },
  },
  mounted() {
    this.fetchTestimonials();
  },
};
</script>

<style scoped>
.testimonial-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.card-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2d3748;
  font-weight: 700;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.rating-select-container {
  position: relative;
}

.star-display-preview {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.75rem;
  justify-content: center;
}

.preview-star {
  stroke-width: 1;
  fill: #e2e8f0;
  stroke: #e2e8f0;
}

.preview-star.star-filled {
  fill: #f59e0b;
  stroke: #f59e0b;
}

.char-count {
  position: absolute;
  right: 8px;
  bottom: -20px;
  font-size: 0.75rem;
  color: #718096;
}

.submit-button {
  width: 100%;
  padding: 0.85rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button:not(:disabled):hover {
  background-color: #2c5282;
}

.submit-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.message {
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.message-icon {
  flex-shrink: 0;
}

.error-message {
  color: #c53030;
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
}

.success-message {
  color: #2f855a;
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
}

.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.testimonial-item {
  padding: 1.25rem;
  border-radius: 8px;
  background-color: #f8fafc;
  border-left: 4px solid #3182ce;
  transition: transform 0.2s ease;
}

.testimonial-item:hover {
  transform: translateX(5px);
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.testimonial-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.star-display {
  display: flex;
  gap: 0.125rem;
}

.star-icon {
  stroke-width: 1;
  fill: #e2e8f0;
  stroke: #e2e8f0;
  transition: fill 0.3s;
}

.star-filled {
  fill: #f59e0b;
  stroke: #f59e0b;
}

.testimonial-content {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #718096;
  text-align: center;
}

.empty-icon {
  margin-bottom: 1rem;
  color: #a0aec0;
}

.empty-subtitle {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .testimonial-container {
    padding: 1rem;
  }
  
  .testimonial-card {
    padding: 1.5rem;
  }
  
  .testimonial-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>