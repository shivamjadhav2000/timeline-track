import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'TimelineTrack',
      fileName: (format) => (format === 'es' ? 'timeline-track.mjs' : 'timeline-track.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
          'lucide-react': 'LucideReact',
        },
      },
    },
  },
})
