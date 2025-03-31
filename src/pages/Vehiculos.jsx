import React, { useEffect, useState } from 'react';
import { FaCar, FaPlus } from 'react-icons/fa';
import axiosInstance from '../axiosConfig';
import '../Styles/Vehiculos.css';

function Vehiculos({ userInfo }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Verificar que userInfo esté definido
        if (!userInfo) {
            console.error('userInfo is undefined');
            return;
        }

        // Obtener la lista de vehículos
        const fetchVehiculos = async () => {
            try {
                const response = await axiosInstance.get('/vehiculos');
                let vehiculosData = response.data;

                // Filtrar los vehículos si el usuario es un conductor
                if (userInfo.rol_id === 2) {
                    vehiculosData = vehiculosData.filter(vehiculo => vehiculo.id_conductor === userInfo.id);
                }

                setVehiculos(vehiculosData);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        // Obtener la lista de conductores
        const fetchConductores = async () => {
            try {
                const response = await axiosInstance.get('/conductores');
                // Filtrar solo los conductores activos
                const conductoresActivos = response.data.filter(conductor => conductor.activo === 1);
                setConductores(conductoresActivos);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        fetchVehiculos();
        fetchConductores();
    }, [userInfo]);

    const handleAddCar = () => {
        setIsModalOpen(true); // Abre el modal para agregar un nuevo vehículo
    };

    const closeModal = () => {
        setIsModalOpen(false); // Cierra el modal
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const nuevoVehiculo = {
            marca: formData.get('brand'),
            modelo: formData.get('model'),
            numero_taxi: formData.get('identificationNumber'),
            id_conductor: formData.get('driverId'),
            activo: 1
        };


        // Enviar los datos al servidor para crear un nuevo vehículo
        axiosInstance.post('/vehiculos', nuevoVehiculo)
            .then(response => {
                // Actualizar la lista de vehículos con el nuevo vehículo
                setVehiculos(prevVehiculos => [...prevVehiculos, { ...nuevoVehiculo, id: response.data.id }]);
                closeModal();
            })
            .catch(error => {
                console.error('Error creating new vehicle:', error);
                alert(`Error creating new vehicle: ${error.message}`);
            });
    };

    return (
        <div className="container">
            <h1>Vehículos</h1>
            <div className="cards-container">
                {vehiculos.map(vehiculo => (
                    <div className="card" key={vehiculo.id}>
                        <FaCar className="car-icon" />
                        <div className="card-content">
                            <h2>{vehiculo.marca} - {vehiculo.modelo}</h2>
                            <p>Número de identificación: {vehiculo.numero_taxi}</p>
                            <p>Conductor ID: {vehiculo.id_conductor}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Mostrar el botón de agregar vehículo solo si el usuario es un administrador */}
            {userInfo.rol_id !== 2 && (
                <button className="create-button" onClick={handleAddCar}>
                    <FaPlus /> Agregar Vehículo
                </button>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Agregar Nuevo Vehículo</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Marca:
                                <input type="text" name="brand" required />
                            </label>
                            <label>
                                Modelo:
                                <input type="text" name="model" required />
                            </label>
                            <label>
                                Número de Identificación:
                                <input type="text" name="identificationNumber" required />
                            </label>
                            <label>
                                Nombre del Conductor:
                                <select name="driverId" required>
                                    <option value="">Seleccione un conductor</option>
                                    {conductores.map(conductor => (
                                        <option key={conductor.id} value={conductor.id}>
                                            {conductor.nombre_completo}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="modal-buttons">
                                <button type="button" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Vehiculos;
