import "./index.css";
import logo from "./estaticos/logo.png";

function Header({ onLogout, usuario }) {
  console.log("Usuario en Header:", usuario);

  return (
    <header className="header">
      <img className="logo" src={logo} alt="Logo" />

      {usuario && (
        <div className="usuario-info">
          <span className="nombre-usuario">{usuario}</span>
          <button className="boton-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;

