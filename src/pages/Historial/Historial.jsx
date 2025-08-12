import React, { useState, useEffect } from "react";
import "./Historial.css";
import { Link } from "react-router-dom";

function Historial() {
  const [pqrs, setPqrs] = useState([]);

  // Cargar datos desde localStorage
  useEffect(() => {
    const dataGuardada = JSON.parse(localStorage.getItem("pqrs")) || [];
    setPqrs(dataGuardada);
  }, []);

  // Función para borrar el historial
  const borrarHistorial = () => {
    localStorage.removeItem("pqrs");
    setPqrs([]); // Limpiar el estado local también
  };

  return (
    <div className="historial-container">
      <nav>
        <Link className="volver-btn" to="/">
          🏠 Volver al Inicio
        </Link>
      </nav>

      <h2> 📜 Historial de Solicitudes PQRS </h2>

      {pqrs.length === 0 ? (
        <p>No hay solicitudes registradas aún.</p>
      ) : (
        <>
          <button onClick={borrarHistorial} className="borrar-btn">
            🗑 Borrar Historial
          </button>
          <table className="tabla">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pqrs.map((item, index) => (
                <tr key={index}>
                  <td>{item.tipo}</td>
                  <td>{item.nombre}</td>
                  <td>{item.email}</td>
                  <td>{item.mensaje}</td>
                  <td>{item.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Historial;
