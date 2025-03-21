<template>
  <v-container class="trainer-container">
    <!-- Search Field -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-text-field
          v-model="search"
          label="Search by Name or Specialty"
          clearable
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          class="mb-4 search-bar"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Trainer Profiles -->
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="trainer-profile">
          <v-slide-group show-arrows>
            <v-slide-group-item v-for="trainer in filteredTrainers" :key="trainer._id">
              <v-card class="profile-content mx-3" elevation="6">
                <!-- Avatar with Fallback -->
                <v-avatar size="120" class="mx-auto">
                  <v-img
                    :src="trainer.profile_image_url || defaultAvatar"
                    alt="Trainer Profile"
                  ></v-img>
                </v-avatar>

                <!-- Trainer Details -->
                <v-card-title class="mt-3 text-primary text-h6">
                  {{ trainer.full_name }}
                </v-card-title>
                <v-card-text>
                  <p><strong>Bio:</strong> {{ trainer.bio_text || 'No bio available' }}</p>
                  <p><strong>Specialization:</strong> {{ trainer.specialty || 'Not specified' }}</p>
                </v-card-text>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>

          <!-- No Results Section -->
          <div v-if="filteredTrainers.length === 0" class="no-results">
            <v-icon size="48" color="grey">mdi-emoticon-sad-outline</v-icon>
            <p>No trainers found. Please try a different search term.</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { TrainersService } from '@/_services/api/admin/trainers.service'
import appConfig from '../app-config'

export default {
  setup() {
    const trainers = ref<any[]>([])
    const search = ref<string>('')
    const defaultAvatar = 'https://avatar.iran.liara.run/public/boy' // Default avatar URL

    onMounted(async () => {
      try {
        const response = await TrainersService.getAllTrainers()
        response.data.forEach((element: any) => {
          element.full_name = `${element.user_id.first_name} ${element.user_id.last_name}`
          element.profile_image_url = element.profile_image
            ? `${appConfig.VUE_APP_API_BASE_URL}${element.profile_image}`
            : defaultAvatar
        })
        trainers.value = response.data
      } catch (error) {
        console.error('Error fetching trainer profiles:', error)
      }
    })

    // Filter Trainers Based on Search
    const filteredTrainers = computed(() => {
      if (!search.value) return trainers.value
      return trainers.value.filter((trainer) => {
        const nameMatch = trainer.full_name.toLowerCase().includes(search.value.toLowerCase())
        const specialtyMatch = trainer.specialty?.toLowerCase().includes(search.value.toLowerCase())
        return nameMatch || specialtyMatch
      })
    })

    return { trainers, search, filteredTrainers, defaultAvatar }
  },
}
</script>

<style lang="scss">
/* Container and Layout */
.trainer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  // background: linear-gradient(135deg, #e3f2fd, #bbdefb);
}

/* Search Bar */
.search-bar {
  max-width: 400px;
}

/* Profile Card */
.trainer-profile {
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* Profile Content */
.profile-content {
  width: 250px;
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  background-color: #fafafa;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

/* Hover Effect */
.profile-content:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

/* Avatar Styling */
.v-avatar {
  border: 3px solid #1976d2;
}

/* Slide Group */
.v-slide-group {
  padding: 20px 0;
}

/* Center Align Slide Items */
.v-slide-group__content {
  padding: 50px;
  justify-content: space-around;
  // justify-content: center;
}

/* No Results Message */
.no-results {
  margin-top: 20px;
  text-align: center;
  color: #757575;
}

.text-primary {
  color: #1976d2;
}
</style>
