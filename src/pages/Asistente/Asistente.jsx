import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Asistente.css";

// Base de Conocimiento Ampliada del Asistente
const baseConocimiento = [
  { keywords: ["peticion", "solicitud formal"], respuesta: "Una **Petición** es una solicitud formal para requerir información, documentación o un servicio. El plazo de respuesta legal es de 15 días hábiles." },
  { keywords: ["queja", "inconformidad", "servicio"], respuesta: "Una **Queja** es la manifestación de inconformidad frente a la atención o el servicio recibido. Debe ser respondida en 15 días hábiles." },
  { keywords: ["reclamo", "incumplimiento", "exigencia", "corregir"], respuesta: "Un **Reclamo** es una exigencia formal que busca la corrección de un error o el cumplimiento de un derecho o servicio que fue incumplido (Ej. facturación errónea). Plazo: 15 días hábiles." },
  { keywords: ["sugerencia", "mejorar", "innovacion", "idea"], respuesta: "Una **Sugerencia** es una propuesta para mejorar la calidad de nuestros servicios o la atención al público. Su respuesta no tiene un plazo legal estricto, pero se agradece." },
  { keywords: ["plazo", "tiempo de respuesta", "cuanto demora"], respuesta: "Generalmente, el plazo legal máximo para dar respuesta a una PQRS es de **15 días hábiles**. En casos especiales, este plazo puede extenderse." },
  { keywords: ["anonimo", "identificacion", "datos personales"], respuesta: "Puedes enviar una **Sugerencia** de forma anónima, pero si envías una Petición, Queja o Reclamo, necesitas datos de contacto válidos para recibir la respuesta oficial." },
  { keywords: ["correo", "notificacion", "respuesta"], respuesta: "La respuesta oficial a tu PQRS será enviada principalmente al correo electrónico que proporcionaste en el formulario, o a tu dirección física si lo solicitaste." },
  { keywords: ["documentos", "adjuntar", "evidencia"], respuesta: "Si tu solicitud requiere soporte (ej. facturas, correos), puedes mencionar la evidencia en la descripción y te contactaremos para solicitarte el envío de los documentos anexos." }
];

// Preguntas Sugeridas para el usuario
const preguntasSugeridas = [
    "¿Cuál es el plazo de respuesta?",
    "Diferencia entre queja y reclamo",
    "¿Puedo enviar la PQR de forma anónima?",
    "¿Cómo sé que mi solicitud fue radicada?",
];


function Asistente() {
  const [mensaje, setMensaje] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const chatBoxRef = useRef(null); // Referencia para el scroll

  // Función para mantener el scroll al final del chat
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [respuestas]); // Ejecutar cuando cambie el historial de respuestas

  // Función de búsqueda (sin cambios)
  const generarRespuesta = (texto) => {
    texto = texto.toLowerCase();

    for (const item of baseConocimiento) {
      if (item.keywords.some(keyword => texto.includes(keyword))) {
        return item.respuesta;
      }
    }

    return "Lo siento, no tengo una respuesta específica para eso. Intenta preguntar sobre: Petición, Queja, Reclamo, Sugerencia o el plazo de respuesta.";
  };

  const handleEnviar = (preguntaTexto) => {
    const texto = preguntaTexto || mensaje.trim();
    if (!texto) return;

    const nuevaRespuesta = {
      pregunta: texto,
      respuesta: generarRespuesta(texto),
    };

    setRespuestas([...respuestas, nuevaRespuesta]);
    setMensaje(""); // Limpia el input si no se usó una sugerencia
  };
  
  // Nuevo: Maneja el clic en una pregunta sugerida
  const handleSugerenciaClick = (pregunta) => {
    handleEnviar(pregunta); // Llama a enviar con la pregunta predefinida
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEnviar();
    }
  };

  return (
    <div className="asistente-container">
      <nav>
        <Link className="iten" to="/">
          🏠 Inicio
        </Link>
      </nav>

      <h2 className="titulo2"> 🤖 Asistente Virtual PQRS </h2>
      <p className="instruccion">Pregunta sobre los tipos de PQRS, plazos, o usa las sugerencias de abajo.</p>

      <div className="chat-box" ref={chatBoxRef}>
        {/* Mensaje de Bienvenida */}
        <div className="mensaje asistente">
            <p>
                <strong>Asistente:</strong> ¡Hola! Soy el Asistente PQRS. Pregúntame sobre la diferencia entre Petición, Queja, Reclamo y Sugerencia o sus plazos.
            </p>
        </div>
        
        {/* Historial de Respuestas */}
        {respuestas.map((item, index) => (
          <React.Fragment key={index}>
            <div className="mensaje usuario">
              <p>
                <strong>Tú:</strong> {item.pregunta}
              </p>
            </div>
            <div className="mensaje asistente">
              <p>
                <strong>Asistente:</strong> {item.respuesta}
              </p>
            </div>
          </React.Fragment>
        ))}
        {/* Placeholder para mantener el scroll al final */}
        <div className="chat-end-placeholder"></div>
      </div>
      
      {/* Preguntas Sugeridas */}
      <div className="sugerencias-box">
        {preguntasSugeridas.map((pregunta, index) => (
            <button 
                key={index} 
                className="sugerencia-btn"
                onClick={() => handleSugerenciaClick(pregunta)}
            >
                {pregunta}
            </button>
        ))}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={() => handleEnviar()}>Enviar</button>
      </div>
    </div>
  );
}

export default Asistente;