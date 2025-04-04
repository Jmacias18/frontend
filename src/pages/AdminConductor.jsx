import React, { useEffect, useState } from 'react';
import { FaPen, FaSearch, FaPlus, FaTrashAlt } from "react-icons/fa";
import axiosInstance from '../axiosConfig';
import "../Styles/AdminConductor.css";

function AdminConductor() {
    const [usuarios, setUsuarios] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        fetchConductores();
    }, []);

    const fetchConductores = () => {
        axiosInstance.get('/conductores')
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setModalMessage(`Error fetching data: ${error.message}`);
                setModalVisible(true);
            });
    };

    const handleEdit = (usuario) => {
        setEditingUser(usuario);
        setIsModalOpen(true); // Abrir el modal para editar
    };

    const handleSave = (event) => {
        event.preventDefault();
        const { id, nombre_completo, correo, telefono, activo } = editingUser;
        const dataToSend = { nombre_completo, correo, telefono, activo: activo !== undefined ? activo : 1 };

        // Validaciones
        if (!nombre_completo || !correo || !telefono) {
            setModalMessage('Todos los campos son obligatorios');
            setModalVisible(true);
            return;
        }

        axiosInstance.put(`/conductores/${id}`, dataToSend)
            .then(response => {
                setEditingUser(null);
                setIsModalOpen(false); // Cerrar el modal después de guardar
                // Actualizar el estado de usuarios localmente
                setUsuarios(prevUsuarios => prevUsuarios.map(usuario =>
                    usuario.id === id ? { ...usuario, nombre_completo, correo, telefono, activo: 1 } : usuario
                ));
            })
            .catch(error => {
                console.error('Error updating user:', error);
                setModalMessage(`Error updating user: ${error.message}`);
                setModalVisible(true);
            });
    };

    const handleDelete = (id) => {
        axiosInstance.put(`/conductores/${id}`, { activo: 0 })
            .then(response => {
                // Actualizar el estado de usuarios localmente
                setUsuarios(prevUsuarios => prevUsuarios.map(usuario =>
                    usuario.id === id ? { ...usuario, activo: 0 } : usuario
                ));
            })
            .catch(error => {
                console.error('Error marking user as inactive:', error);
                setModalMessage(`Error marking user as inactive: ${error.message}`);
                setModalVisible(true);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateProfile = () => {
        setEditingUser({ nombre_completo: '', correo: '', telefono: '', contraseña: '' }); // Limpiar el usuario en edición
        setIsModalOpen(true); // Abrir el modal para crear
    };

    const closeModal = () => {
        setIsModalOpen(false); // Cerrar el modal
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const nuevoPerfil = Object.fromEntries(formData.entries());
        nuevoPerfil.rol = 2; // Asegurarse de que el rol sea 'conductor'
        nuevoPerfil.activo = 1; // Asegurarse de que el conductor esté activo

        // Validaciones
        if (!nuevoPerfil.nombre_completo || !nuevoPerfil.correo || !nuevoPerfil.telefono || !nuevoPerfil.contraseña) {
            setModalMessage('Todos los campos son obligatorios');
            setModalVisible(true);
            return;
        }

        // Verificar si el correo ya existe
        try {
            const responseCorreo = await axiosInstance.get(`/conductores?correo=${nuevoPerfil.correo}`);
            if (responseCorreo.data.some(usuario => usuario.correo === nuevoPerfil.correo)) {
                setModalMessage('El correo electrónico ya existe');
                setModalVisible(true);
                return;
            }
        } catch (error) {
            console.error('Error checking existing email:', error);
            setModalMessage(`Error checking existing email: ${error.message}`);
            setModalVisible(true);
            return;
        }

        // Verificar si el teléfono ya existe
        try {
            const responseTelefono = await axiosInstance.get(`/conductores?telefono=${nuevoPerfil.telefono}`);
            if (responseTelefono.data.some(usuario => usuario.telefono === nuevoPerfil.telefono)) {
                setModalMessage('El número de teléfono ya existe');
                setModalVisible(true);
                return;
            }
        } catch (error) {
            console.error('Error checking existing phone number:', error);
            setModalMessage(`Error checking existing phone number: ${error.message}`);
            setModalVisible(true);
            return;
        }


        // Enviar los datos al servidor para crear un nuevo conductor
        axiosInstance.post('/conductores', nuevoPerfil)
            .then(response => {
                // Actualizar la lista de usuarios con el nuevo conductor
                setUsuarios(prevUsuarios => [...prevUsuarios, { ...nuevoPerfil, id: response.data.id }]);
                closeModal();
            })
            .catch(error => {
                console.error('Error creating new profile:', error);
                setModalMessage(`Error creating new profile: ${error.message}`);
                setModalVisible(true);
            });
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.activo === 1 && (usuario.nombre_completo || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    const handleKeyPress = (event) => {
        const regex = /^[A-Za-z\s]+$/;
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    };

    const handlePhoneKeyPress = (event) => {
        const regex = /^[0-9+]+$/;
        if (!regex.test(event.key)) {
            event.preventDefault();
        }
    };

    return (
        <div className="container">
            <h1>Administrar Conductor</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaSearch />
                <input
                    type="text"
                    placeholder="Buscar nombre"
                    className="inp"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="listcontainer">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Correo</th>
                            <th>Nombre Completo</th>
                            <th>Telefono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.correo}</td>
                                <td>{usuario.nombre_completo}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.rol === 2 ? 'Conductor' : 'Otro Rol'}</td>
                                <td>
                                    <FaPen
                                        className="icon"
                                        onClick={() => handleEdit(usuario)}
                                    />
                                    <FaTrashAlt
                                        className="icon"
                                        onClick={() => handleDelete(usuario.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="create-profile-button" onClick={handleCreateProfile}>
                <FaPlus /> Crear Perfil
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingUser && editingUser.id ? 'Editar Conductor' : 'Agregar Nuevo Perfil'}</h2>
                        <form onSubmit={editingUser && editingUser.id ? handleSave : handleSubmit}>
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    name="nombre_completo"
                                    value={editingUser ? editingUser.nombre_completo : ''}
                                    onChange={handleChange}
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity('Este campo es obligatorio')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    onKeyPress={handleKeyPress}
                                />
                            </label>
                            <label>
                                Correo:
                                <input
                                    type="email"
                                    name="correo"
                                    value={editingUser ? editingUser.correo : ''}
                                    onChange={handleChange}
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity('Este campo es obligatorio')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                />
                            </label>
                            <label>
                                Telefono:
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={editingUser ? editingUser.telefono : ''}
                                    onChange={handleChange}
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity('Este campo es obligatorio')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    onKeyPress={handlePhoneKeyPress}
                                />
                            </label>
                            <label>
                                Contraseña:
                                <input
                                    type="password"
                                    name="contraseña"
                                    value={editingUser && editingUser.id ? '' : editingUser?.contraseña || ''}
                                    onChange={handleChange}
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity('Este campo es obligatorio')}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                />
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

            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Error</h2>
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalVisible(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminConductor;
