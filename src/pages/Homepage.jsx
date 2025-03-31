import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import '@fontsource/poppins'; // Fuente Poppins
import logo from '../assets/gosafe_logo2.png'; // Importa el logo
import fondo from '../assets/fondo_llamada.jpg'; // imagen de fondo 
import fondo2 from '../assets/imagen2.jpg';

function Homepage() {
  return (
    <div className="homepage">
      {/* Parte 1 */}
      <section id="parte1" className="section parte1">
        <div className="fondo-container">
          <img src={fondo} alt="fondo" className="fondo" />
        </div>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="right-content">
          <h2 className="text">Viaja a cualquier</h2>
          <h2 className="text">lugar con la App</h2>
          <a href="#parte2" className="button button1">
            Descargar Para Android
          </a>
        </div>
      </section>

      {/* Parte 2 */}

      <section id="parte2" className="section parte2">
      <div className="fondo-container">
          <img src={fondo2} alt="fondo2" className="fondo2" />
        </div>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="content">
          <h2 className="text">Administra</h2>
          <h2 className="text">en tiempo real</h2>
          <Link to="/login" className="button button2">
            Iniciar Sesión
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Homepage;