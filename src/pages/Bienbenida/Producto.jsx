// src/components/Producto.jsx (Manteniendo la estructura lateral original)
import { Link } from "react-router-dom";
import "./Producto.css";
import peticionImg from "../../assets/peticion.png";
import quejaImg from "../../assets/queja.png";
import reclamoImg from "../../assets/reclamo.png";
import sugerenciaImg from "../../assets/sugerencia.png";
import logo from "../../assets/logo.png";
import asistenteImg from "../../assets/asistente.png";
import historialImg from "../../assets/historial.png";

function Producto({ onLogout }) {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="producto-container">
      <aside className="menu-lateral">
        <h2>MENU</h2>
        <ul>
          <li>
            <img src={peticionImg} alt="Petición" className="icono" />
            <Link to="/peticion">PETICION</Link>
          </li>
          <li>
            <img src={quejaImg} alt="Queja" className="icono" />
            <Link to="/queja">QUEJA</Link>
          </li>
          <li>
            <img src={reclamoImg} alt="Reclamo" className="icono" />
            <Link to="/reclamo">RECLAMO</Link>
          </li>
          <li>
            <img src={sugerenciaImg} alt="Sugerencia" className="icono" />
            <Link to="/sugerencia">SUGERENCIA</Link>
          </li>
          <li>
            <img src={asistenteImg} alt="asistente" className="icono" />
            <Link to="/asistente">ASISTENTE</Link>
          </li>
          <li>
            <img src={historialImg} alt="historial" className="icono" />
            <Link to="/historial">Historial PQRS</Link>
          </li>
        </ul>

        <button
          type="button"
          className="cerrar-sesion-btn"
          onClick={handleLogout}
        >
          CERRAR SESIÓN
        </button>
      </aside>

      <main className="contenido-principal">
        <p>
          <strong>
            <img src={logo} alt="Logo" className="logo-principal" />
            Esta página está diseñada para facilitar la gestión de Peticiones,
            Quejas, Reclamos y Sugerencias (PQRS)
          </strong>{" "}
          relacionadas con el servicio de acueducto. Aquí podrás comunicarte
          directamente con nosotros, hacer seguimiento a tus solicitudes y
          contribuir a mejorar la calidad del servicio que prestamos a la
          comunidad.
        </p>
      </main>
    </div>
  );
}

export default Producto;