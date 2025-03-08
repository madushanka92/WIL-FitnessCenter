<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-text-field
          v-model="search"
          label="Search by Name or Specialty"
          clearable
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="trainer-profile">
          <v-slide-group show-arrows>
            <!-- <v-slide-group-item v-for="trainer in trainers" :key="trainer._id"> -->
            <v-slide-group-item v-for="trainer in filteredTrainers" :key="trainer._id">
              <v-card class="profile-content mx-3">
                <v-avatar size="120" class="mx-auto">
                  <v-img :src="trainer.profile_image_url" alt="Trainer Profile"></v-img>
                </v-avatar>
                <v-card-title class="mt-3">{{ trainer.full_name }}</v-card-title>
                <v-card-text>
                  <p><strong>Bio:</strong> {{ trainer.bio_text }}</p>
                  <p><strong>Specialization:</strong> {{ trainer.specialty }}</p>
                </v-card-text>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
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
    const trainers = ref([])
    const search = ref('')

    onMounted(async () => {
      try {
        const response = await TrainersService.getAllTrainers()
        response.data.forEach((element: any) => {
          element.full_name = element.user_id.first_name + ' ' + element.user_id.last_name

          if (element.profile_image)
            element.profile_image_url = appConfig.VUE_APP_API_BASE_URL + element.profile_image
        })
        trainers.value = response.data
      } catch (error) {
        console.error('Error fetching trainer profile:', error)
      }
    })

    // 🛠 Computed Property for Filtering Trainers
    const filteredTrainers = computed(() => {
      if (!search.value) return trainers.value // If search is empty, return all trainers

      return trainers.value.filter((trainer: any) => {
        const nameMatch = trainer.full_name.toLowerCase().includes(search.value.toLowerCase())
        const specialtyMatch = trainer.specialty?.toLowerCase().includes(search.value.toLowerCase())

        return nameMatch || specialtyMatch // Match by name OR specialty
      })
    })

    return { trainers, search, filteredTrainers }

    // return { trainers }
  },
}
</script>

<style scoped>
.trainer-profile {
  padding: 20px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-content {
  width: 250px;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
}

.v-avatar {
  border: 3px solid #1976d2;
}

.v-text-field {
  max-width: 400px;
  margin: 0 auto;
}
</style>
