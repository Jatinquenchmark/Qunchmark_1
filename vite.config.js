import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/* `npm run dev` only: serve the Vercel functions in /api through Vite, so the
   Reach Us form can be tested locally. Secrets come from .env.local (git-ignored)
   and are only ever read on the server side. Production uses Vercel's runtime. */
function devApi(env) {
  return {
    name: 'qm-dev-api',
    apply: 'serve',
    configureServer(server) {
      for (const [k, v] of Object.entries(env)) if (!(k in process.env)) process.env[k] = v
      server.middlewares.use('/api/enquiry', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/enquiry.js')
          await mod.default(req, res)
        } catch (e) {
          console.error(e)
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: 'Dev API error' }))
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ''))],
  base: "/",
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["lenis"],
          three: ["three"],
        },
      },
    },
  },
}))
