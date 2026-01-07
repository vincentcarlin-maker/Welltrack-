
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nexstep-hub/', // Assurez-vous que '/nexstep-hub/' correspond au nom de votre dépôt GitHub
});
