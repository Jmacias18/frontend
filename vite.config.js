import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Puedes usar '0.0.0.0' si quieres acceder desde otra red
    port: 5200, // Cambia el puerto aquí
  },
});
