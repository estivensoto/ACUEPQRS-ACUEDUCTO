import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/login.jsx";
import Producto from "./pages/Bienbenida/Producto.jsx";
import Peticion from "./pages/Peticion/Peticion.jsx";
import Queja from "./pages/Queja/Queja.jsx";
import Reclamo from "./pages/Reclamo/Reclamo.jsx";
import Sugerencia from "./pages/Sugerencias/Sugerencia.jsx";
import Confirmacion from "./pages/Confirmacion/confirmacion.jsx";
import Asistente from "./pages/Asistente/Asistente.jsx";
import Historial from "./pages/Historial/Historial.jsx";
import Registro from "./pages/Registro/Registro.jsx";

function App() {
  const [autenticado, setAutenticado] = useState(false);

  const handleLogin = () => {
    setAutenticado(true);
  };

  const handleLogout = () => {
    setAutenticado(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        {!autenticado && (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/registro" element={<Registro onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {/* Rutas privadas (requieren login) */}
        {autenticado && (
          <>
            <Route path="/" element={<Producto onLogout={handleLogout} />} />
            <Route path="/peticion" element={<Peticion />} />
            <Route path="/queja" element={<Queja />} />
            <Route path="/reclamo" element={<Reclamo />} />
            <Route path="/sugerencia" element={<Sugerencia />} />
            <Route path="/confirmacion" element={<Confirmacion />} />
            <Route path="/asistente" element={<Asistente />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
