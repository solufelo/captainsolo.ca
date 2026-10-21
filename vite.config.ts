import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // public/assets holds unhashed media; hashed build output goes elsewhere so it can be cached forever.
    assetsDir: '_app',
  },
  server: {
    // `npm run dev` has no Worker; send the contact form to `wrangler dev` if it's running.
    proxy: { '/api': 'http://localhost:8787' },
  },
})
