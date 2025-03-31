import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import gosafeLogo from "../assets/gosafe_logo2.png";
import "../Styles/Sidebar.css";

function Sidebar({ userInfo }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const handleLogout = () => {
        navigate("/");
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/dashboard/conductores", label: "Administrar Conductor" },
        { path: "/dashboard/pasajeros", label: "Administrar Pasajero" },
        { path: "/dashboard/vehiculos", label: "Vehículos" },
        { path: "/dashboard/historial-conductor", label: "Historial Conductor" },
    ];

    const filteredNavLinks = userInfo
    ? userInfo.rol_id === 2
        ? navLinks.filter(link => link.path !== "/dashboard/conductores" && link.path !== "/dashboard/pasajeros")
        : navLinks.filter(link => link.path !== "/dashboard") // Excluir "Dashboard" para administradores
    : navLinks;


    return (
        <div className="sidebar-container">
            {/* Botón para abrir/cerrar el sidebar */}
            {!isOpen && (
                <button onClick={toggleSidebar} className="sidebar-toggle-button">
                    <FaBars />
                </button>
            )}

            {/* Sidebar */}
            <nav className={`sidebar ${isOpen ? "" : "closed"}`}>
                {isOpen && (
                    <>
                        {/* Botón de cerrar */}
                        <button onClick={toggleSidebar} className="sidebar-close-button">
                            <FaTimes />
                        </button>

                        {/* Logo */}
                        <img src={gosafeLogo} alt="Go Safe Logo" className="sidebar-logo" />

                        {/* User Info */}
                        <div className="user-info">
                            <div className="user-avatar">👤</div>
                            <p className="user-name">{userInfo ? userInfo.nombre : "Nombre"}</p>
                            <p className="user-email">{userInfo ? userInfo.correo : "Correo Electrónico"}</p>
                        </div>

                        {/* Navigation Links */}
                        <ul className="nav-links">
                            {filteredNavLinks.map((item) => (
                                <li key={item.path} className="nav-item">
                                    <Link
                                        to={item.path}
                                        className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Logout Button */}
                        <button onClick={handleLogout} className="logout-button">
                            <FaSignOutAlt /> Cerrar Sesión
                        </button>
                    </>
                )}
            </nav>

            {/* Contenedor principal */}
            <div className={`main-content ${isOpen ? "" : "sidebar-closed"}`}>
                {/* Aquí va el contenido principal de la página */}
            </div>
        </div>
    );
}

export default Sidebar;