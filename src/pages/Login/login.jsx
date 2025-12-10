import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

// ⚠️ IMPORTANTE: En una aplicación real, esta información NO debe
// estar aquí. Debe obtenerse de una API/Servidor que valide las
// credenciales contra una base de datos segura.
const USUARIOS_REGISTRADOS = [
  { usuario: "admin", clave: "12345" },
  { usuario: "cliente1", clave: "pass123" },
  { usuario: "prueba", clave: "secreto" },
];

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  // Aunque no se usa en este componente, se mantiene para consistencia
  // const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores anteriores

    // 1. Verificar que ambos campos no estén vacíos (mantiene la lógica previa)
    if (usuario.trim() === "" || clave.trim() === "") {
      setError("Por favor ingresa nombre de usuario y contraseña.");
      return;
    }

    // 2. Buscar si las credenciales coinciden con algún usuario registrado
    const usuarioEncontrado = USUARIOS_REGISTRADOS.find(
      (user) => user.usuario === usuario && user.clave === clave
    );

    if (usuarioEncontrado) {
      // 3. Credenciales correctas: Llamar a onLogin y limpiar campos
      onLogin(); // Llama a la función de prop para cambiar el estado de autenticación
      // Opcional: limpiar los campos después de un inicio de sesión exitoso
      // setUsuario("");
      // setClave("");
      console.log(`Usuario ${usuario} ha iniciado sesión con éxito.`);
    } else {
      // 4. Credenciales incorrectas: Mostrar mensaje de error específico
      setError(
        "Credenciales incorrectas. Verifica tu nombre de usuario y contraseña."
      );
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

          {/* Mostrar mensaje de error */}
          {error && <p className="error-mensaje">{error}</p>}
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