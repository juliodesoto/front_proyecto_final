
import { useEffect, useState } from "react";
import Header from "./Header";
import Login from "./Login";
import Decisiones from "./Decisiones";

function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/session", {
      credentials: "include"
    })
      .then(res => {
        console.log("Respuesta cruda:", res); // 👈 log intermedio
        return res.json();
      })
      .then(data => {
        console.log("Datos parseados:", data); // 👈 este es el importante
        if (data.usuario) {
          setLogueado(true);
          setUsuario(data.usuario);
          setTipoUsuario(data.tipo);
        }
      })
      .catch(err => console.error("Error al obtener la sesión:", err)); // 👈 captura de errores
  }, []);

  const handleLogout = () => {
    fetch("http://localhost:3000/logout", {
      credentials: "include"
    }).then(() => {
      setLogueado(false);
      setUsuario("");
      setTipoUsuario(""); // Limpiar tipo de usuario al cerrar sesión
    });
  };

  const handleLoginSuccess = () => {
    setLogueado(true);

    // Obtener el usuario y tipo tras iniciar sesión
    fetch("http://localhost:3000/session", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.usuario) {
          setUsuario(data.usuario);
          setTipoUsuario(data.tipo); // Guardamos el tipo de usuario
        }
      });
  };

  return (
    <div>
      <Header usuario={usuario} onLogout={logueado ? handleLogout : null} />

      {logueado ? (
        <>
          <div className='textoInicial'>
            <p>Si estás indeciso y no sabes qué decisión tomar, aquí estamos para ponértelo más fácil.</p>
          </div>
          <Decisiones tipoUsuario={tipoUsuario} /> {/* Pasamos tipoUsuario a Decisiones */}
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
