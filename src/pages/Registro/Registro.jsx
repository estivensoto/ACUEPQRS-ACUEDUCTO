// src/pages/Registro.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importamos 'Link' aquí
import "./Registro.css";

// Función de cifrado simple (¡SOLO PARA DEMOSTRACIÓN!)
const simpleEncrypt = (password) => {
  return `hashed_pwd_${password.length}chars`;
};

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const hashedPassword = simpleEncrypt(formData.password);

    const userData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      passwordHash: hashedPassword,
      fechaRegistro: new Date().toISOString(),
    };

    console.log("Datos de registro listos para enviar al backend:", userData);
    
    localStorage.setItem("usuarioRegistrado", JSON.stringify(userData));

    onLogin(userData.email);
    
    navigate("/");
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

        {/* Correo Electrónico */}
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
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
        
        <button type="submit" disabled={!formData.aceptaTerminos}>
            Registrarse
        </button>

        {/* Botón de Regreso a Login */}
        <Link to="/login" className="back-link">
            <button type="button" className="secondary-button">
                ← Volver a Iniciar Sesión
            </button>
        </Link>
        {/* Fin del Botón de Regreso */}

      </form>
    </div>
  );
};

export default Registro;