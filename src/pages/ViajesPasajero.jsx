import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const ViajesPasajero = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance.get('/viajes_pasajero')  // Reemplaza '/viajes_pasajero' con el endpoint de tu API
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Viajes Pasajero</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViajesPasajero;