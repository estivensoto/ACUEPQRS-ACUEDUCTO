import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./reclamo.css";
import reclamoImg from "../../assets/reclamo.png";

const Reclamo = () => {
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
      tipo: "reclamo",
      ...formData,
    };

    // 👉 Guardar también en localStorage
    const nuevaSolicitud = {
      tipo: "Reclamo",
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
    <div>
      <div className="reclamo-container">
        <nav style={{ marginBottom: "20px" }}>
          <Link className="iten" to="/">
            🏠 Inicio
          </Link>
        </nav>
        <div className="titulo">
          <h1> 📢 RECLAMOS </h1>
        </div>

        <img src={reclamoImg} alt="Reclamo" className="reclamo-imagen" />

        <form className="reclamo-form" onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Reclamo;
