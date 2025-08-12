import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (usuario.trim() !== "" && clave.trim() !== "") {
      onLogin(); // Inicia sesión si ambos campos están llenos
    } else {
      setError("Por favor ingresa nombre de usuario y contraseña");
    }
  };

  return (
    <div className="contenedor-principal">
      <div className="texto-bienvenida">
        <img
          className="imagen-inferior"
          src="/imagenes/logo.jpg"
          alt="Decoración"
        />
        <h1 className="titulo1">
          Bienvenido a nuestro canal oficial de PQRS!
          <br />
          Tu opinión es fundamental para mejorar cada día.
          <br />
          <span>
            Estamos aquí para escucharte y responderte con transparencia y
            compromiso.
          </span>
        </h1>
      </div>

      <form onSubmit={manejarEnvio} className="formulario-login">
        <h2>Iniciar Sesión</h2>
        <div className="inicio">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />

          <button type="submit"> 🔐 Iniciar Sesión </button>

          {/* Botón de registro */}
          <Link to="/registro">
            <button type="button" style={{ marginTop: "10px" }}>
              📝 Registrarse
            </button>
          </Link>

          {error && <p>{error}</p>}
        </div>

        <div className="footer-links">
          <a href="#">Términos de Servicios</a>
          <a href="#">Política de privacidad</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
