import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Dashboard({ userInfo }) {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehiculos, setVehiculos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir al administrador si intenta acceder al Dashboard
        if (userInfo?.rol_id === 3) {
            navigate('/dashboard/conductores', { replace: true });
            return;
        }

        // Verificar que userInfo esté definido
        if (!userInfo) {
            console.error('userInfo is undefined');
            return;
        }

        // Obtener los datos de la API
        const fetchData = async () => {
            try {
                const url = 'http://kscggogk8sw0kkokwg04gco0.31.170.165.191.sslip.io/api/viajes/conductor';
                const response = await axios.get(url);

                // Filtrar los viajes en el frontend si el usuario es un conductor
                let filteredViajes = response.data;
                if (userInfo.rol_id === 2) {
                    filteredViajes = response.data.filter(viaje => viaje.id_conductor === userInfo.id);
                }

                // Procesar los datos para sumar los kilómetros por fecha
                const kmPorFecha = filteredViajes.reduce((acc, viaje) => {
                    const fecha = new Date(viaje.fecha).toLocaleDateString();
                    if (!acc[fecha]) {
                        acc[fecha] = 0;
                    }
                    acc[fecha] += parseFloat(viaje.distancia_km);
                    return acc;
                }, {});

                // Convertir el objeto en un array de objetos
                const data = Object.keys(kmPorFecha).map(fecha => ({
                    fecha,
                    km: kmPorFecha[fecha]
                }));

                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Obtener los vehículos del conductor
        const fetchVehiculos = async () => {
            try {
                const response = await axios.get('http://kscggogk8sw0kkokwg04gco0.31.170.165.191.sslip.io/api/vehiculos');

                // Filtrar los vehículos en el frontend si el usuario es un conductor
                let filteredVehiculos = response.data;
                if (userInfo.rol_id === 2) {
                    filteredVehiculos = response.data.filter(vehiculo => vehiculo.id_conductor === userInfo.id);
                }

                setVehiculos(filteredVehiculos);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchData();
        fetchVehiculos();
    }, [userInfo, navigate]);

    // Funciones para abrir y cerrar el modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="dashboard-container">
            <h1>Kilometraje Recorrido</h1>
            
            {/* Gráfico */}
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="km" fill="#4ba961" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Mostrar el botón solo si el usuario no es un administrador */}
            {userInfo.rol_id !== 3 && (
                <button onClick={openModal} className="generate-qr-button">
                    Generar Numero De Vehiculo
                </button>
            )}

            {/* Simulación del Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Tu código</h2>
                        {vehiculos.map(vehiculo => (
                            <p key={vehiculo.id}>{vehiculo.numero_taxi}</p>
                        ))}
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* Estilos embebidos */}
            <style>{`
                .dashboard-container {
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                    background-color: "#e9e9e9";
                }

                .chart-container {
                    margin-bottom: 20px;
                    background-color: #fffafa;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .generate-qr-button {
                    background-color: #4ba961;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 20px;
                }

                .generate-qr-button:hover {
                    background-color: #16a34a;
                }

                /* Estilos para el modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5); /* Oscurecer el fondo */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background-color: #fffafa;
                    padding: 20px;
                    border-radius: 8px;
                    width: 300px;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }

                .qr-container img {
                    width: 100px;
                    height: 100px;
                    margin-top: 20px;
                }

                /* Botón para cerrar el modal */
                .modal-content button {
                    background-color: #4ba961;
                    color: #fffafa;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    cursor: pointer;
                }

                .modal-content button:hover {
                    background-color: #16a34a;
                }

                /* Media Queries */
                @media (max-width: 768px) {
                    .chart-container {
                        padding: 10px;
                    }

                    .generate-qr-button {
                        width: 100%;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Dashboard;