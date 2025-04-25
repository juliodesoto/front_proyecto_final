
import { useEffect, useState } from "react";
import Header from "./Header";
import Login from "./Login";
import Decisiones from "./Decisiones";

function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  useEffect(() => {
    fetch("https://backend-proyecto-final-wg41.onrender.com/session", {
      credentials: "include"
    })
      .then(res => {
        console.log("Respuesta cruda:", res);
        return res.json();
      })
      .then(data => {
        console.log("Datos parseados:", data);
        if (data.usuario) {
          setLogueado(true);
          setUsuario(data.usuario);
          setTipoUsuario(data.tipo);
        }
      })
      .catch(err => console.error("Error al obtener la sesión:", err));
  }, []);

  const handleLogout = () => {
    fetch("https://backend-proyecto-final-wg41.onrender.com/logout", {
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
    fetch("https://backend-proyecto-final-wg41.onrender.com/session", {
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
