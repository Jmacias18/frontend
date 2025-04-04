import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import axiosInstance from '../axiosConfig';
import "../Styles/HistorialConductor.css";

const HistorialConductor = ({ userInfo }) => {
    const [viajes, setViajes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const [itemsPerPage] = useState(10); // Número de viajes por página

    useEffect(() => {
        // Verificar que userInfo esté definido
        if (!userInfo) {
            console.error('userInfo is undefined');
            return;
        }

        // Obtener la lista de viajes
        const fetchViajes = async () => {
            try {
                // Obtener todos los viajes
                const url = '/viajes/conductor';
                const response = await axiosInstance.get(url);

                // Filtrar los viajes en el frontend si el usuario es un conductor
                let filteredViajes = response.data;
                if (userInfo.rol_id === 2) {
                    filteredViajes = response.data.filter(viaje => viaje.id_conductor === userInfo.id);
                }
                setViajes(filteredViajes);
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };

        fetchViajes();
    }, [userInfo]);

    const filteredViajes = viajes.filter(viaje =>
        viaje.direccion_inicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        viaje.direccion_fin.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage; // Índice del último viaje en la página
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Índice del primer viaje en la página
    const currentItems = filteredViajes.slice(indexOfFirstItem, indexOfLastItem); // Viajes a mostrar en la página actual

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Páginas de paginación (basado en el número total de viajes filtrados)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredViajes.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container">
            <h1>Historial De Viaje Conductor</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaSearch />
                <input
                    type="text"
                    placeholder="Buscar dirección"
                    className="inp"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="listcontainer">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Distancia</th>
                            <th>Dirección Inicial</th>
                            <th>Dirección Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((viaje) => (
                            <tr key={viaje.id}>
                                <td>{new Date(viaje.fecha).toLocaleDateString()}</td>
                                <td>{new Date(viaje.fecha).toLocaleTimeString()}</td>
                                <td>{viaje.distancia_km} km</td>
                                <td>{viaje.direccion_inicio}</td>
                                <td>{viaje.direccion_fin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Controles de Paginación */}
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={number === currentPage ? 'active' : ''}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === pageNumbers.length}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistorialConductor;
