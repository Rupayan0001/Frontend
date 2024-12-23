import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['process'],  // Exclude dotenv from frontend bundle
  },
  server: {
    host: '0.0.0.0', // or use your local IP address
  },

})

// resolve: {
//   alias: {
//     'dotenv': false, // Exclude dotenv
//   },
// },