import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import AdminConductor from "./pages/AdminConductor";
import AdminPasajero from "./pages/AdminPasajero";
import Vehiculos from "./pages/Vehiculos";
import ViajesPasajero from "./pages/ViajesPasajero";
import HistorialConductor from "./pages/HistorialConductor"; // Importa el nuevo componente
import { useState } from "react";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<Homepage />} />

      {/* Página de Login */}
      <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />

      {/* Dashboard con barra lateral */}
      <Route path="/dashboard/*" element={<LayoutWithSidebar userInfo={userInfo} />}>
        {/* Redirigir al administrador si intenta acceder al Dashboard */}
        <Route
          index
          element={
            userInfo ? (
              userInfo.rol_id === 1 ? (
                <Navigate to="/dashboard/conductores" replace />
              ) : (
                <Dashboard userInfo={userInfo} />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="conductores" element={<AdminConductor />} />
        <Route path="pasajeros" element={<AdminPasajero />} />
        <Route path="vehiculos" element={<Vehiculos userInfo={userInfo} />} />
        <Route path="viajes_pasajero" element={<ViajesPasajero />} />
        <Route path="historial-conductor" element={<HistorialConductor userInfo={userInfo} />} />
      </Route>

      {/* Redirección si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Layout que incluye la barra lateral
function LayoutWithSidebar({ userInfo }) {
  return (
    <div style={{ display: "flex", backgroundColor: "#e1e9f0" }}>
      <Sidebar userInfo={userInfo} />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          {/* Redirigir al administrador si intenta acceder al Dashboard */}
          <Route
            index
            element={
              userInfo ? (
                userInfo.rol_id === 1 ? (
                  <Navigate to="/dashboard/conductores" replace />
                ) : (
                  <Dashboard userInfo={userInfo} />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="conductores" element={<AdminConductor />} />
          <Route path="pasajeros" element={<AdminPasajero />} />
          <Route path="vehiculos" element={<Vehiculos userInfo={userInfo} />} />
          <Route path="viajes_pasajero" element={<ViajesPasajero />} />
          <Route path="historial-conductor" element={<HistorialConductor userInfo={userInfo} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;