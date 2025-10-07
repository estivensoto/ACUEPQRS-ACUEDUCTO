import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ¡IMPORTANTE! VERIFICA ESTAS DOS RUTAS:
import "./peticion.css"; // Debe estar en el MISMO directorio que este archivo
import peticionImg from "../../assets/peticion.png"; // ¡Ajusta esta ruta a tu estructura de carpetas!

const Peticion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // CAMPOS FORMALES
    entidadDestino: "",         
    objetoPeticion: "",         
    
    // DATOS DEL PETICIONARIO
    nombres: "",
    apellidos: "",
    tipoIdentificacion: "CC",
    nIdentificacion: "",
    direccionNotificacion: "",
    email: "",                 
    telefonoCelular: "",
    
    // CONTENIDO DE LA PETICIÓN
    fundamentosHechos: "",     
    solicitudConcreta: "",     
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

  // Función de Validación (mejorada para verificar todos los campos)
  const validateForm = () => {
    const requiredFields = [
        'entidadDestino', 'objetoPeticion', 'nombres', 'apellidos', 
        'tipoIdentificacion', 'nIdentificacion', 'direccionNotificacion', 
        'email', 'fundamentosHechos', 'solicitudConcreta'
    ];
    for (const field of requiredFields) {
        if (!formData[field].trim()) {
            setValidationError(`El campo *${field}* es obligatorio.`);
            return false;
        }
    }

    if (formData.fundamentosHechos.trim().length < 20 || formData.solicitudConcreta.trim().length < 10) {
        setValidationError("Los campos de hechos y solicitud deben ser descriptivos (mín. 20 y 10 caracteres).");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setValidationError("Por favor, ingrese un formato de correo electrónico válido.");
        return false;
    }

    const phoneRegex = /^\d{7,10}$/; 
    if (formData.telefonoCelular && !phoneRegex.test(formData.telefonoCelular)) {
      setValidationError("Teléfono Celular no tiene un formato válido (7-10 dígitos numéricos).");
      return false;
    }

    setValidationError(""); 
    return true;
  };
  
  // Usamos una variable para determinar si el botón debe estar habilitado
  const isFormFullyFilled = Object.values(formData).every(val => 
      (typeof val === 'string' && val.trim().length > 0) || (typeof val === 'number' && val !== 0)
  );


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ejecuta la validación final antes de enviar
    if (!validateForm()) {
      return; 
    }
    
    setIsSubmitting(true); 

    const datosConTipo = {
      tipo: "Derecho de Petición (Ley 1755)",
      ...formData,
    };

    const nuevaSolicitud = {
      tipo: "Petición Formal",
      entidad: formData.entidadDestino,
      nombre: `${formData.nombres} ${formData.apellidos}`,
      identificacion: formData.nIdentificacion,
      asunto: formData.objetoPeticion,
      fecha: new Date().toLocaleString(),
    };

    // Almacenamiento Local (Simulación de histórico)
    const solicitudesAnteriores =
      JSON.parse(localStorage.getItem("pqrs")) || [];
    solicitudesAnteriores.push(nuevaSolicitud);
    localStorage.setItem("pqrs", JSON.stringify(solicitudesAnteriores));

    // Envío al Backend (Asegúrate de que el servidor en localhost:3001 esté activo)
    fetch("http://localhost:3001/api/pqrs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosConTipo),
    })
      .then((res) => {
        setIsSubmitting(false); 
        if (!res.ok) {
            // Manejo de errores de respuesta HTTP
            throw new Error(`Error del servidor: ${res.statusText}`);
        }
        return res.text();
      })
      .then((data) => {
        console.log("Respuesta del backend:", data);
        // Redirige al usuario a la página de confirmación
        navigate("/confirmacion");
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.error("Error al enviar:", err);
        setValidationError(`Error de conexión o servidor: ${err.message}. Por favor, verifique la conexión del backend.`);
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
        <h1> PETICIÓN </h1>
        <p className="subtitulo-formal">Formulario basado en requisitos legales colombianos.</p>
      </div>

      <img src={peticionImg} alt="Petición" className="peticion-imagen" />

      {validationError && (
        <p className="validation-error-message">🚨 {validationError}</p>
      )}

      <form className="formulario-form" onSubmit={handleSubmit}>
        
        {/* Sección 1: Datos de Destino */}
        <p className="seccion-titulo">1. Datos de Destino (*)</p>
        <input
          type="text"
          name="entidadDestino"
          placeholder="* Señores: Nombre de la Entidad o Autoridad a la que se dirige"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="objetoPeticion"
          placeholder="* Asunto: Objeto o Referencia Principal de la Petición"
          onChange={handleChange}
          required
        />
        
        <hr className="separator"/>

        {/* Sección 2: Datos del Peticionario */}
        <p className="seccion-titulo">2. Datos del Solicitante (*)</p>
        <input
          type="text"
          name="nombres"
          placeholder="* Nombres Completos"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="* Apellidos Completos"
          onChange={handleChange}
          required
        />
        
        <select 
            name="tipoIdentificacion"
            onChange={handleChange}
            value={formData.tipoIdentificacion}
            required
        >
            <option value="" disabled>Seleccione Tipo de Identificación *</option>
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="NIT">NIT (Persona Jurídica)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
            <option value="PA">Pasaporte (PA)</option>
        </select>

        <input
          type="text"
          name="nIdentificacion"
          placeholder="* Número de Identificación"
          onChange={handleChange}
          required
          maxLength="15"
        />
        
        <hr className="separator"/>

        {/* Sección 3: Notificación y Contacto */}
        <p className="seccion-titulo">3. Dirección de Notificación (*)</p>
        <input
          type="email"
          name="email"
          placeholder="* Correo Electrónico (Medio de Notificación principal)"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccionNotificacion"
          placeholder="* Dirección de Correspondencia Completa (para Notificación)"
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

        {/* Sección 4: Contenido de la Petición */}
        <p className="seccion-titulo">4. Fundamento y Solicitud (*)</p>
        <textarea
          name="fundamentosHechos"
          placeholder="* FUNDAMENTOS DE HECHO: Describa de forma clara, precisa y respetuosa los hechos o razones (Mínimo 20 caracteres)."
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="solicitudConcreta"
          placeholder="* PETICIÓN/SOLICITUD CONCRETA: Especifique qué desea obtener (Mínimo 10 caracteres)."
          onChange={handleChange}
          required
        ></textarea>
        
        <button 
          type="submit"
          disabled={!isFormFullyFilled || isSubmitting || validationError} // Deshabilitado si hay errores o está enviando
        >
          {isSubmitting ? "Enviando Petición..." : "Generar y Radicar Petición"}
        </button>
        
        <p className="required-fields-note">(*) Campos obligatorios según Ley 1755 de 2015.</p>
      </form>
    </div>
  );
};

export default Peticion;