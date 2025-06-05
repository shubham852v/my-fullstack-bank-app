import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The 'resolve' block is generally fine and can remain.
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  // Removed the 'esbuild' block as it's causing the "loader" must be a string error.
  // Ensure all your React component files are named with .jsx or .tsx extensions.
})
