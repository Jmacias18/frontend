import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../Styles/Login.css";
import logo from "../assets/gosafe_logo.png"; // Asegúrate de que la imagen esté en la carpeta correcta

function Login({ setUserInfo }) {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [errors, setErrors] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!correo) {
            errors.correo = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(correo)) {
            errors.correo = 'El correo electrónico no es válido';
        }
        if (!contraseña) {
            errors.contraseña = 'La contraseña es obligatoria';
        }
        return errors;
    };

    const handleLogin = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setModalMessage(Object.values(validationErrors).join('\n'));
            setModalVisible(true);
            return;
        }

        // Intentar iniciar sesión como administrador
        axios.post('http://kscggogk8sw0kkokwg04gco0.31.170.165.191.sslip.io/api/auth/login/admin', {
            correo,
            contraseña
        })
        .then(response => {
            // Manejar la respuesta del servidor para administrador
            setUserInfo(response.data.user); // Almacenar la información del usuario en el estado
            if (response.data.user.rol_id === 1) {
                navigate("/dashboard/conductores"); // Redirigir a "Administrar Conductor" si es administrador
            } else {
                navigate("/dashboard");
            }
        })
        .catch(error => {
            // Si falla, intentar iniciar sesión como conductor
            console.error('Error logging in as admin:', error);
            axios.post('http://kscggogk8sw0kkokwg04gco0.31.170.165.191.sslip.io/api/auth/login/conductor', {
                correo,
                contraseña
            })
            .then(response => {
                // Manejar la respuesta del servidor para conductor
                setUserInfo(response.data.user); // Almacenar la información del usuario en el estado
                if (response.data.user.rol_id === 2) {
                    navigate("/dashboard"); // Redirigir al dashboard si es conductor
                }
            })
            .catch(error => {
                // Manejar errores
                console.error('Error logging in as conductor:', error);
                setModalMessage('Correo o contraseña incorrectos');
                setModalVisible(true);
            });
        });
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="login-form">
                <h2>Iniciar sesión</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="login-input"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="login-input"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                />
                <button onClick={handleLogin} className="login-button">Iniciar sesión</button>
            </div>

            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Error</h2>
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalVisible(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            <style>{`
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
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    width: 300px;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }

                .modal-content button {
                    background-color: #4ba961;
                    color: #fff;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    cursor: pointer;
                }

                .modal-content button:hover {
                    background-color: #16a34a;
                }
            `}</style>
        </div>
    );
}

export default Login;