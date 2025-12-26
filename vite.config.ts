import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base: "./"' est CRUCIAL pour le déploiement sur GitHub Pages (chemins relatifs)
  base: './',
  define: {
    // Remplace process.env.API_KEY par la valeur réelle lors du build (npm run build)
    // Cela permet à l'application de fonctionner sans serveur backend
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})