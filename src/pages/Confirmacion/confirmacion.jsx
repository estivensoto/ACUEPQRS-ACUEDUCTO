import React from "react";
import { useNavigate } from "react-router-dom";
import "./confirmacion.css";

const Confirmacion = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmacion-container">
      <h2>SOLICITUD</h2>
      <div className="mensaje">
        <p>
          <strong>Tu solicitud ha sido enviada exitosamente.</strong>
        </p>
        <p>Muchas gracias, nos estaremos comunicando.</p>
        <button className="boton-regresar" onClick={() => navigate("/")}>
          REGRESAR
        </button>
      </div>
    </div>
  );
};

export default Confirmacion;
