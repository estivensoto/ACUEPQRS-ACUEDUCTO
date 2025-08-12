import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./queja.css"; // Usa el mismo CSS que Peticion
import quejaImg from "../../assets/queja.png";

const Queja = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoIdentificacion: "",
    nIdentificacion: "",
    telefonoCelular: "",
    telefonoFijo: "",
    direccion: "",
    hechos: "",
    pretensiones: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datosConTipo = {
      tipo: "queja",
      ...formData,
    };

    // 👉 Guardar en localStorage
    const nuevaSolicitud = {
      tipo: "Queja",
      nombre: `${formData.nombres} ${formData.apellidos}`,
      email: formData.nIdentificacion,
      mensaje: formData.hechos,
      fecha: new Date().toLocaleString(),
    };

    const solicitudesAnteriores =
      JSON.parse(localStorage.getItem("pqrs")) || [];
    solicitudesAnteriores.push(nuevaSolicitud);
    localStorage.setItem("pqrs", JSON.stringify(solicitudesAnteriores));

    // 👉 Enviar al backend
    fetch("http://localhost:3001/api/pqrs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosConTipo),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log("Respuesta del backend:", data);
        navigate("/confirmacion");
      })
      .catch((err) => {
        console.error("Error al enviar:", err);
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
        <h1> 😠 QUEJAS </h1>
      </div>

      <img src={quejaImg} alt="Queja" className="queja-imagen" />

      <form className="formulario-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tipoIdentificacion"
          placeholder="Tipo Identificación"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nIdentificacion"
          placeholder="N° Identificación"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefonoCelular"
          placeholder="Teléfono Celular"
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefonoFijo"
          placeholder="Teléfono Fijo"
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          onChange={handleChange}
        />
        <textarea
          name="hechos"
          placeholder="Hechos"
          onChange={handleChange}
        ></textarea>
        <textarea
          name="pretensiones"
          placeholder="Pretensiones"
          onChange={handleChange}
        ></textarea>
        <button type="submit">📄 Generar</button>
      </form>
    </div>
  );
};

export default Queja;
