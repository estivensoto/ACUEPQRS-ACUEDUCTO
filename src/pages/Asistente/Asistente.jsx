import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Asistente.css";

function Asistente() {
  const [mensaje, setMensaje] = useState("");
  const [respuestas, setRespuestas] = useState([]);

  const handleEnviar = () => {
    if (!mensaje.trim()) return;

    const nuevaRespuesta = {
      pregunta: mensaje,
      respuesta: generarRespuesta(mensaje),
    };

    setRespuestas([...respuestas, nuevaRespuesta]);
    setMensaje("");
  };

  const generarRespuesta = (texto) => {
    texto = texto.toLowerCase();

    if (texto.includes("peticion"))
      return "Una petición es una solicitud formal relacionada con el servicio.";
    if (texto.includes("queja"))
      return "Una queja es la manifestación de inconformidad frente a algo.";
    if (texto.includes("reclamo"))
      return "Un reclamo es una exigencia por el incumplimiento de un deber.";
    if (texto.includes("sugerencia"))
      return "Una sugerencia es una propuesta para mejorar el servicio.";

    return "Lo siento, no entiendo tu mensaje. ¿Podrías reformularlo?";
  };

  return (
    <div className="asistente-container">
      <nav>
        <Link className="iten" to="/">
          🏠 Inicio
        </Link>
      </nav>

      <h2 className="titulo2"> 🤖 Asistente Virtual PQRS </h2>

      <div className="chat-box">
        {respuestas.map((item, index) => (
          <div key={index} className="mensaje">
            <p>
              <strong>Tú:</strong> {item.pregunta}
            </p>
            <p>
              <strong>Asistente:</strong> {item.respuesta}
            </p>
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleEnviar}>Enviar</button>
      </div>
    </div>
  );
}

export default Asistente;
