import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./sugerencia.css"; // Debe estar en el mismo directorio
import sugerenciaImg from "../../assets/sugerencia.png";

const Sugerencia = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // DATOS DE LA SUGERENCIA
    areaSugerencia: "",         // Nuevo: Área de la entidad a la que aplica la sugerencia
    propuestaValor: "",         // Nuevo: Breve descripción de la idea
    
    // DATOS DEL SUGERENTE (OPCIONALES PARA ANONIMATO)
    nombres: "",
    apellidos: "",
    tipoIdentificacion: "",
    nIdentificacion: "",
    email: "",                  // Se mantiene opcional
    telefonoCelular: "",
    
    // CONTENIDO DE LA SUGERENCIA (OBLIGATORIO)
    sugerenciaDetallada: "",    // Descripción completa de la propuesta
    beneficiosEsperados: "",    // Qué se logra con la sugerencia
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
    // Solo los campos de la sugerencia son OBLIGATORIOS
    const requiredSuggestionFields = [
        'areaSugerencia', 'propuestaValor', 'sugerenciaDetallada'
    ];
    
    for (const field of requiredSuggestionFields) {
        if (!formData[field].trim()) {
            setValidationError(`El campo *${field}* es obligatorio.`);
            return false;
        }
    }

    if (formData.sugerenciaDetallada.trim().length < 50) {
        setValidationError("La Sugerencia Detallada debe ser descriptiva (mín. 50 caracteres).");
        return false;
    }
    
    // Si se ingresa el email, se valida el formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
        setValidationError("Si ingresa un correo, debe ser un formato válido.");
        return false;
    }

    setValidationError(""); 
    return true;
  };

  // El botón se habilita si todos los campos OBLIGATORIOS están llenos
  const isFormFullyFilled = 
    formData.areaSugerencia.trim().length > 0 &&
    formData.propuestaValor.trim().length > 0 &&
    formData.sugerenciaDetallada.trim().length > 0;


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; 
    }
    
    setIsSubmitting(true); 

    const datosConTipo = {
      tipo: "Sugerencia",
      ...formData,
    };

    const nuevaSolicitud = {
      tipo: "Sugerencia",
      objeto: formData.propuestaValor,
      nombre: formData.nombres.trim() ? `${formData.nombres} ${formData.apellidos}` : "Anónimo",
      identificacion: formData.nIdentificacion,
      mensaje: formData.sugerenciaDetallada,
      fecha: new Date().toLocaleString(),
    };

    // --- Lógica de LocalStorage ---
    const solicitudesAnteriores =
      JSON.parse(localStorage.getItem("pqrs")) || [];
    solicitudesAnteriores.push(nuevaSolicitud);
    localStorage.setItem("pqrs", JSON.stringify(solicitudesAnteriores));
    // ----------------------------------------------------

    // --- Envío al Backend con Manejo de Errores ---
    fetch("http://localhost:3001/api/pqrs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosConTipo),
    })
      .then((res) => {
        setIsSubmitting(false); 
        if (!res.ok) {
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
        setValidationError(`Error al enviar: ${err.message}. Verifique la conexión del backend.`);
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
        <h1> SUGERENCIAS </h1>
        <p className="subtitulo-formal">Proponga una idea de mejora o innovación (el envío anónimo es opcional).</p>
      </div>

      <img src={sugerenciaImg} alt="Sugerencia" className="sugerencia-imagen" />

      {validationError && (
        <p className="validation-error-message">🚨 {validationError}</p>
      )}

      <form className="formulario-form" onSubmit={handleSubmit}>
        
        {/* Sección 1: La Sugerencia (Obligatorio) */}
        <p className="seccion-titulo">1. Contenido de la Sugerencia (*)</p>
        <input
          type="text"
          name="areaSugerencia"
          placeholder="* Área o Proceso que debe mejorar (Ej: Atención al Cliente, Web, Procesos Internos)"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="propuestaValor"
          placeholder="* Propuesta de Valor (Resumen de la idea)"
          onChange={handleChange}
          required
        />
        <textarea
          name="sugerenciaDetallada"
          placeholder="* SUGERENCIA DETALLADA: Explique la idea, cómo funcionaría y por qué es importante (Mínimo 50 caracteres)."
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="beneficiosEsperados"
          placeholder="Beneficios esperados (Ej: Ahorro de tiempo, mejor servicio, menos errores) (Opcional)"
          onChange={handleChange}
        ></textarea>
        
        <hr className="separator"/>

        {/* Sección 2: Datos del Sugerente (Opcional) */}
        <p className="seccion-titulo">2. Datos del Sugerente (Opcional)</p>
        <p className="required-fields-note" style={{textAlign: 'left', fontStyle: 'normal'}}>Dejar en blanco para enviar de forma anónima.</p>

        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          onChange={handleChange}
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          onChange={handleChange}
        />
        
        <select 
            name="tipoIdentificacion"
            onChange={handleChange}
            value={formData.tipoIdentificacion}
        >
            <option value="">Tipo de Identificación (Opcional)</option>
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
        </select>

        <input
          type="text"
          name="nIdentificacion"
          placeholder="N° Identificación"
          onChange={handleChange}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico (Para seguimiento)"
          onChange={handleChange}
        />
        <input
          type="tel" 
          name="telefonoCelular"
          placeholder="Teléfono Celular"
          onChange={handleChange}
        />
        
        <button 
          type="submit"
          disabled={!isFormFullyFilled || isSubmitting || validationError}
        >
          {isSubmitting ? "Enviando Sugerencia..." : " Enviar Sugerencia"}
        </button>
        
        <p className="required-fields-note">(*) Campos obligatorios para el contenido de la idea.</p>
      </form>
    </div>
  );
};

export default Sugerencia;