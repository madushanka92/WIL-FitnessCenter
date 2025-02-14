<template>
  <v-footer app color="primary" dark>
    <v-container class="d-flex justify-space-between align-center">
      <!-- Copyright -->
      <div>© {{ new Date().getFullYear() }} Fitness Center. All rights reserved.</div>

      <!-- Social Media Links -->
      <div>
        <v-btn icon variant="text">
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn icon variant="text">
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn icon variant="text">
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.v-btn {
  color: white;
}
</style>
