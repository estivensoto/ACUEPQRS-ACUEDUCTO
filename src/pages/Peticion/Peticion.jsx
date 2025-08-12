import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./peticion.css";
import peticionImg from "../../assets/peticion.png";

const Peticion = () => {
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
      tipo: "Petición",
      ...formData,
    };

    const nuevaSolicitud = {
      tipo: "Petición",
      nombre: `${formData.nombres} ${formData.apellidos}`,
      email: formData.nIdentificacion,
      mensaje: formData.hechos,
      fecha: new Date().toLocaleString(),
    };

    const solicitudesAnteriores =
      JSON.parse(localStorage.getItem("pqrs")) || [];
    solicitudesAnteriores.push(nuevaSolicitud);
    localStorage.setItem("pqrs", JSON.stringify(solicitudesAnteriores));

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
        <h1> 📩 PETICIONES </h1>
      </div>

      <img src={peticionImg} alt="Petición" className="peticion-imagen" />

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

export default Peticion;
