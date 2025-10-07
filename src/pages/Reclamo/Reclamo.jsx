import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./reclamo.css"; // Debe estar en el mismo directorio
import reclamoImg from "../../assets/reclamo.png";

const Reclamo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // DATOS ESPECÍFICOS DEL RECLAMO
    entidadReclamada: "",       // Nuevo: Entidad o Servicio responsable
    referenciaContrato: "",     // Nuevo: Número de factura, contrato o radicado afectado
    
    // DATOS DEL SOLICITANTE
    nombres: "",
    apellidos: "",
    tipoIdentificacion: "CC",
    nIdentificacion: "",
    email: "",                  // Añadido como campo de notificación obligatorio
    telefonoCelular: "",
    direccion: "",              // Manteniendo para notificación física
    
    // CONTENIDO DEL RECLAMO
    fundamentosHechos: "",     // Descripción del incumplimiento/error
    solicitudConcreta: "",     // La corrección o indemnización que se exige
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
        'entidadReclamada', 'referenciaContrato', 'nombres', 'apellidos', 
        'nIdentificacion', 'email', 'direccion', 'fundamentosHechos', 'solicitudConcreta'
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
      tipo: "Reclamo",
      ...formData,
    };

    const nuevaSolicitud = {
      tipo: "Reclamo",
      objeto: formData.referenciaContrato,
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

    // --- Envío al Backend con Seguridad (Manejo de Errores) ---
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
        <h1> RECLAMOS (Corrección de Servicio) </h1>
        <p className="subtitulo-formal">Solicitud formal de corrección, cumplimiento o indemnización de un servicio o derecho.</p>
      </div>

      <img src={reclamoImg} alt="Reclamo" className="reclamo-imagen" />

      {validationError && (
        <p className="validation-error-message">🚨 {validationError}</p>
      )}

      <form className="formulario-form" onSubmit={handleSubmit}>
        
        {/* Sección 1: Objeto del Reclamo */}
        <p className="seccion-titulo">1. Objeto del Reclamo (*)</p>
        <input
          type="text"
          name="entidadReclamada"
          placeholder="* Entidad o Área responsable de la falla"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="referenciaContrato"
          placeholder="* N° de Contrato, Factura o Radicado de Referencia"
          onChange={handleChange}
          required
        />
        
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
            <option value="NIT">NIT</option>
        </select>

        <input
          type="text"
          name="nIdentificacion"
          placeholder="* N° Identificación"
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
          name="direccion"
          placeholder="* Dirección de Correspondencia Completa"
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

        {/* Sección 4: Hechos y Solicitud */}
        <p className="seccion-titulo">4. Fundamento y Solicitud (*)</p>
        <textarea
          name="fundamentosHechos"
          placeholder="* HECHOS: Describa el incumplimiento, error o falla que motiva su reclamo (Mínimo 30 caracteres)."
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="solicitudConcreta"
          placeholder="* SOLICITUD CONCRETA: Especifique la corrección, cumplimiento o indemnización que exige."
          onChange={handleChange}
          required
        ></textarea>
        
        <button 
          type="submit"
          disabled={!isFormFullyFilled || isSubmitting || validationError}
        >
          {isSubmitting ? "Enviando Reclamo..." : "Generar Reclamo"}
        </button>
        
        <p className="required-fields-note">(*) Campos obligatorios.</p>
      </form>
    </div>
  );
};

export default Reclamo;