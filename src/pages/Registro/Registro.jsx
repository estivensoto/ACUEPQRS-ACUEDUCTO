// src/pages/Registro.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Registro.css";

// Dirección URL de tu script PHP
const REGISTER_API_URL = "http://localhost/ACUEPQRS_Backend/registro.php";

const Registro = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false,
  });
  const [errors, setErrors] = useState({});
  const [registroStatus, setRegistroStatus] = useState(null); // 'success', 'error', 'loading'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
    if (errors.global) {
      setErrors((prevErrors) => ({ ...prevErrors, global: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.nombre.length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres.";
    }
    if (formData.apellido.length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres.";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }
    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos una mayúscula.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos un número.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = "Debes aceptar los términos y condiciones.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setRegistroStatus('loading');
    setErrors({});

    const userDataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataToSend),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setRegistroStatus('success');
        console.log("Registro exitoso:", result.message);

        onLogin(userDataToSend.email);

        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        setRegistroStatus('error');
        // El mensaje de error viene del PHP (ej: "El correo electrónico ya está registrado.")
        setErrors({ global: result.message || "Error desconocido al intentar registrar el usuario." });
        console.error("Error del Backend:", result.message);
      }
    } catch (error) {
      // ESTE ES EL ERROR QUE SIGUES VIENDO: FALLO DE CONEXIÓN
      setRegistroStatus('error');
      setErrors({ global: "ERROR CRÍTICO: No se pudo conectar al servidor. Revisa el Paso 3." });
      console.error("Error de Fetch/Conexión:", error);
    } finally {
        if(registroStatus === 'loading') setRegistroStatus(null); 
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario Seguro</h2>
      <form className="registro-form" onSubmit={handleSubmit}>
        
        {/* Nombre */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        {errors.nombre && <p className="error-message">{errors.nombre}</p>}
        
        {/* Apellido */}
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        {errors.apellido && <p className="error-message">{errors.apellido}</p>}

        {/* Correo Electrónico (será el nombre de usuario) */}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico (Será tu Usuario)"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        {/* Contraseña */}
        <input
          type="password"
          name="password"
          placeholder="Contraseña (Mín. 8 caracteres, Mayús., Número)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        
        {/* Confirmar Contraseña */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        
        {/* Términos y Condiciones */}
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="aceptaTerminos"
            id="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={handleChange}
          />
          <label htmlFor="aceptaTerminos">Acepto los <Link to="/terminos">Términos y Condiciones</Link></label>
        </div>
        {errors.aceptaTerminos && <p className="error-message">{errors.aceptaTerminos}</p>}
        
        {/* Mensajes de Estado Global / Errores del Backend */}
        {errors.global && <p className="error-message">{errors.global}</p>}
        {registroStatus === 'success' && <p className="success-message">✅ ¡Registro exitoso! Redirigiendo...</p>}
        
        <button 
          type="submit" 
          disabled={!formData.aceptaTerminos || registroStatus === 'loading'}
        >
          {registroStatus === 'loading' ? 'Registrando...' : 'Registrarse'}
        </button>

        {/* Botón de Regreso a Login */}
        <Link to="/login" className="back-link">
          <button type="button" className="secondary-button" disabled={registroStatus === 'loading'}>
            ← Volver a Iniciar Sesión
          </button>
        </Link>

      </form>
    </div>
  );
};

export default Registro;