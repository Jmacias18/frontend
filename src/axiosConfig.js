import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://kscggogk8sw0kkokwg04gco0.31.170.165.191.sslip.io/api', // URL base de tu API en producción
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;