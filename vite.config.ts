import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  // Served at tools.joinestateflow.com/ai-estate-sale-listing (see vercel.json).
  base: '/ai-estate-sale-listing/',
  plugins: [react(), tailwindcss()],
  // Pre-render build (scripts/prerender.mjs): bundle CSS imports instead of leaving them to Node.
  ssr: { noExternal: [/^@fontsource/] },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
})