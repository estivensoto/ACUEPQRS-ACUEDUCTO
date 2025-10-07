import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./queja.css"; // Asegúrate de que el CSS esté en el mismo directorio
import quejaImg from "../../assets/queja.png";

const Queja = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // DATOS DEL OBJETO DE LA QUEJA
    entidadAfectada: "",        // Nuevo: Entidad o área objeto de la queja
    motivoQueja: "",            // Nuevo: Tipo de queja (Servicio, Atención, Demora)
    
    // DATOS DEL SOLICITANTE
    nombres: "",
    apellidos: "",
    tipoIdentificacion: "CC",
    nIdentificacion: "",
    email: "",                  // Añadido como campo obligatorio para notificación
    telefonoCelular: "",
    
    // CONTENIDO DE LA QUEJA
    fundamentosHechos: "",     // Descripción de lo sucedido
    solicitudConcreta: "",     // Lo que se espera como solución o acción correctiva
  });
  
  const [validationError, setValidationError] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationError) {
      setValidationError("");
    }
  };

  const validateForm = () => {
    // Verificación de Campos Obligatorios y Longitud
    const requiredFields = [
        'entidadAfectada', 'motivoQueja', 'nombres', 'apellidos', 
        'nIdentificacion', 'email', 'fundamentosHechos', 'solicitudConcreta'
    ];
    for (const field of requiredFields) {
        if (!formData[field].trim()) {
            setValidationError(`El campo *${field}* es obligatorio.`);
            return false;
        }
    }

    if (formData.fundamentosHechos.trim().length < 30) {
        setValidationError("La descripción de los hechos debe ser detallada (mín. 30 caracteres).");
        return false;
    }

    // Validación de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setValidationError("Por favor, ingrese un formato de correo electrónico válido para notificación.");
        return false;
    }

    setValidationError(""); 
    return true;
  };

  // El botón se habilitará solo si todos los campos obligatorios están llenos
  const isFormFullyFilled = Object.values(formData).every(val => 
      (typeof val === 'string' && val.trim().length > 0) || (typeof val === 'number' && val !== 0)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; 
    }
    
    setIsSubmitting(true); 

    const datosConTipo = {
      tipo: "Queja",
      ...formData,
    };

    // Preparación para localStorage y Backend (mejorando la estructura de datos)
    const nuevaSolicitud = {
      tipo: "Queja",
      objeto: formData.motivoQueja,
      nombre: `${formData.nombres} ${formData.apellidos}`,
      identificacion: formData.nIdentificacion,
      mensaje: formData.fundamentosHechos,
      fecha: new Date().toLocaleString(),
    };

    // --- Lógica de LocalStorage ---
    const solicitudesAnteriores =
      JSON.parse(localStorage.getItem("pqrs")) || [];
    solicitudesAnteriores.push(nuevaSolicitud);
    localStorage.setItem("pqrs", JSON.stringify(solicitudesAnteriores));
    // ----------------------------------------------------

    // --- Envío al Backend con Manejo de Errores Mejorado ---
    fetch("http://localhost:3001/api/pqrs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosConTipo),
    })
      .then((res) => {
        setIsSubmitting(false); 
        if (!res.ok) {
             // Lanza error si el estado HTTP no es 2xx
            throw new Error(`Error del servidor: ${res.statusText}`);
        }
        return res.text();
      })
      .then((data) => {
        console.log("Respuesta del backend:", data);
        navigate("/confirmacion");
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.error("Error al enviar:", err);
        // Feedback claro al usuario
        setValidationError(`Error al enviar: ${err.message}. Verifique su conexión o el estado del servidor.`);
      });
  };

  return (
    <div className="formulario-container">
      <nav>
        <Link className="iten" to="/">
          🏠 Inicio
        </Link>
      </nav>

      <div className="titulo">
        <h1> QUEJAS </h1>
        <p className="subtitulo-formal">Manifieste su inconformidad con el servicio o atención.</p>
      </div>

      <img src={quejaImg} alt="Queja" className="queja-imagen" />

      {validationError && (
        <p className="validation-error-message">🚨 {validationError}</p>
      )}

      <form className="formulario-form" onSubmit={handleSubmit}>
        
        {/* Sección 1: Objeto de la Queja */}
        <p className="seccion-titulo">1. Objeto de la Queja (*)</p>
        <input
          type="text"
          name="entidadAfectada"
          placeholder="* Nombre del Servidor o Área objeto de la queja"
          onChange={handleChange}
          required
        />

        <select 
            name="motivoQueja"
            onChange={handleChange}
            value={formData.motivoQueja}
            required
        >
            <option value="" disabled>* Seleccione el Motivo de la Queja</option>
            <option value="Servicio">Inconformidad con el Servicio</option>
            <option value="Atencion">Mala Atención al Ciudadano</option>
            <option value="Demora">Demora en la Respuesta/Trámite</option>
            <option value="Otro">Otro Motivo</option>
        </select>
        
        <hr className="separator"/>

        {/* Sección 2: Datos del Solicitante */}
        <p className="seccion-titulo">2. Datos del Solicitante (*)</p>
        <input
          type="text"
          name="nombres"
          placeholder="* Nombres"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="* Apellidos"
          onChange={handleChange}
          required
        />
        
        <select 
            name="tipoIdentificacion"
            onChange={handleChange}
            value={formData.tipoIdentificacion}
            required
        >
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
        </select>

        <input
          type="text"
          name="nIdentificacion"
          placeholder="* N° Identificación"
          onChange={handleChange}
          required
          maxLength="15"
        />
        
        <input
          type="email"
          name="email"
          placeholder="* Correo Electrónico (Para Notificación)"
          onChange={handleChange}
          required
        />
        <input
          type="tel" 
          name="telefonoCelular"
          placeholder="Teléfono Celular (Opcional, 7 a 10 dígitos)"
          onChange={handleChange}
          pattern="[0-9]{7,10}"
          title="Ingrese solo números (7 a 10 dígitos)"
        />

        <hr className="separator"/>

        {/* Sección 3: Hechos y Solicitud */}
        <p className="seccion-titulo">3. Descripción y Solicitud (*)</p>
        <textarea
          name="fundamentosHechos"
          placeholder="* HECHOS: Describa detalladamente el incidente que motivó la queja (Mínimo 30 caracteres)."
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="solicitudConcreta"
          placeholder="* SOLICITUD: ¿Qué acción correctiva espera (Ej: Disculpa, corrección del servicio, sanción)?"
          onChange={handleChange}
          required
        ></textarea>
        
        <button 
          type="submit"
          disabled={!isFormFullyFilled || isSubmitting || validationError}
        >
          {isSubmitting ? "Enviando Queja..." : "Generar Queja"}
        </button>
        
        <p className="required-fields-note">(*) Campos obligatorios.</p>
      </form>
    </div>
  );
};

export default Queja;