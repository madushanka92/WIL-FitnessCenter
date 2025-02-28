import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1280, // Set width
    viewportHeight: 800, // Set height
  },
})
