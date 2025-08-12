// src/pages/Registro.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

const Registro = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 Aquí podrías hacer una petición POST al backend
    console.log("Datos registrados:", formData);

    // Guardar en localStorage o enviar al backend real
    localStorage.setItem("usuarioRegistrado", JSON.stringify(formData));

    // ✅ Activar sesión
    onLogin();

    // ✅ Redirige al home
    navigate("/");
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>
      <form className="registro-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
