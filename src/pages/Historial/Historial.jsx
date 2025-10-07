import React, { useState, useEffect } from "react";
import "./Historial.css";
import { Link } from "react-router-dom";

// Función para asignar un ícono basado en el tipo de solicitud
const obtenerIcono = (tipo) => {
    switch (tipo) {
        case "Peticion":
            return "📝";
        case "Queja":
            return "😠";
        case "Reclamo":
            return "📢";
        case "Sugerencia":
            return "💡";
        default:
            return "📁";
    }
};

function Historial() {
  const [pqrs, setPqrs] = useState([]);

  // Cargar datos desde localStorage
  useEffect(() => {
    const dataGuardada = JSON.parse(localStorage.getItem("pqrs")) || [];
    // Opcional: Revertir el orden para mostrar la más reciente primero
    setPqrs(dataGuardada.reverse()); 
  }, []);
  
  // Función simple para generar un número de radicado simulado
  const generarRadicado = (fecha) => {
    // Simulación: Usa la fecha y un número aleatorio corto
    const base = new Date(fecha).getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 900) + 100;
    return `PQRS-${base}-${random}`;
  };

  // Función para borrar el historial
  const borrarHistorial = () => {
    if (window.confirm("¿Está seguro de que desea eliminar permanentemente todo el historial de solicitudes local? Esta acción no se puede deshacer.")) {
        localStorage.removeItem("pqrs");
        setPqrs([]); // Limpiar el estado local también
    }
  };

  return (
    <div className="historial-container">
      <nav>
        <Link className="volver-btn" to="/">
          🏠 Volver al Inicio
        </Link>
      </nav>

      <div className="historial-header">
        <h2> 📜 Historial de Solicitudes PQRS </h2>
        <p className="instruccion-historial">Aquí se muestran las solicitudes que has radicado en este navegador.</p>
        
        {/* Botón Borrar Historial */}
        {pqrs.length > 0 && (
          <button onClick={borrarHistorial} className="borrar-btn">
            🗑 Borrar Historial Local ({pqrs.length})
          </button>
        )}
      </div>

      {pqrs.length === 0 ? (
        <div className="vacio-box">
            <p className="mensaje-vacio">No hay solicitudes registradas aún en este dispositivo. ¡Anímate a radicar la primera!</p>
            <Link className="enlace-inicio" to="/">Ir al Menú Principal</Link>
        </div>
      ) : (
        <div className="cards-grid">
          {pqrs.map((item, index) => (
            <div key={index} className={`card-solicitud ${item.tipo.toLowerCase()}`}>
                <div className="card-header">
                    <span className="card-icono">{obtenerIcono(item.tipo)}</span>
                    <h3 className="card-tipo">{item.tipo}</h3>
                </div>
                
                <div className="card-body">
                    <p className="card-radicado">
                        <strong>Radicado:</strong> {generarRadicado(item.fecha)}
                    </p>
                    <p><strong>Fecha:</strong> {item.fecha}</p>
                    <p><strong>Nombre:</strong> {item.nombre}</p>
                    {item.identificacion && <p><strong>ID:</strong> {item.identificacion}</p>}
                    
                    <div className="card-mensaje">
                        <strong>Objeto/Asunto:</strong>
                        <p>{item.objeto || item.mensaje.substring(0, 80) + '...'}</p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Historial;