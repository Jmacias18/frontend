import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acceso desde cualquier IP
    port: 5200, // Puedes cambiarlo si es necesario
    allowedHosts: [
      "r0g4kww4wwk08k4k00wosw8c.31.170.165.191.sslip.io"
    ],
  },
});
