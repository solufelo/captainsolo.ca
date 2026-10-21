import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // public/assets holds unhashed media; hashed build output goes elsewhere so it can be cached forever.
    assetsDir: '_app',
    rollupOptions: {
      output: {
        // three.js is ~600 KB; keep it in its own chunk so pages without the planet never pay for it.
        manualChunks: (id) => (/node_modules[\\/](three|@react-three)[\\/]/.test(id) ? 'three' : undefined),
      },
    },
  },
  server: {
    // `npm run dev` has no Worker; send the contact form to `wrangler dev` if it's running.
    proxy: { '/api': 'http://localhost:8787' },
  },
})
