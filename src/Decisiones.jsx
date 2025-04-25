import { useState, useEffect } from "react";

// GIFs para mostrar como resultado
const gifHazlo = "https://i.gifer.com/5SW.gif";       // Hazlo
const gifNoLoHagas = "https://i.gifer.com/Ydjm.gif"; // No lo hagas

function Decisiones() {
  const [decisiones, setDecisiones] = useState([]);
  const [nuevaDecision, setNuevaDecision] = useState("");

  // Cargar decisiones desde el backend

  useEffect(() => {

    fetch("http://localhost:3000/decisiones", {
      
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("No autorizado");
        }
        return res.json();
      })
      .then(data => setDecisiones(data))
      .catch(err => {
        console.error("Error al cargar las decisiones:", err);
        setDecisiones([]); // evitar que .map() pete si hay error
      });
  }, []);


  // Crear una nueva decisión
  const agregarDecision = () => {
    if (!nuevaDecision.trim()) return;

    fetch("http://localhost:3000/decisiones/nueva", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ texto: nuevaDecision }),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const gifUrl = "https://i.gifer.com/3z9a.gif"; // GIF de espera
        setDecisiones([
          ...decisiones,
          {
            id: data.id,
            texto: nuevaDecision,
            resultado: gifUrl,
            exito: null
          }
        ]);
        setNuevaDecision("");
      })
      .catch(err => {
        console.error("Error:", err);
      });
  };

  // Actualizar el campo de texto de una decisión
  const actualizarDecisionTexto = (id, cambios) => {
    setDecisiones(decisiones.map(decision => decision.id === id ? { ...decision, texto: cambios.texto } : decision));

    fetch(`http://localhost:3000/decisiones/editar/texto/${id}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ texto: cambios.texto }),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("✏️ Texto actualizado:", data);
      })
      .catch(err => {
        console.error("Error al actualizar el texto:", err);
      });
  };

  // Actualizar el resultado de una decisión
  const actualizarResultado = (id, resultado) => {
    console.log("Actualizando resultado para", id, "->", resultado);

    setDecisiones(decisiones.map(decision => decision.id === id ? { ...decision, resultado } : decision));

    fetch(`http://localhost:3000/decisiones/editar/resultado/${id}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ resultado }),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Resultado actualizado:", data);
      })
      .catch(err => {
        console.error("Error al actualizar el resultado:", err);
      });
  };

  // Eliminar una decisión
  const borrarDecision = (id) => {
    console.log("Borrar decisión con ID:", id);

    fetch(`http://localhost:3000/decisiones/borrar/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.ok) {
          console.log("Decisión borrada, status:", res.status);
          setDecisiones(decisiones.filter(decision => decision.id !== id));
        } else {
          console.warn("No se pudo borrar la decisión");
        }
      })
      .catch(err => {
        console.error("Error al borrar decisión:", err);
      });
  };

  // Función para actualizar el estado de éxito
  const actualizarExito = (id, exito) => {
    setDecisiones(decisiones.map(decision => decision.id === id ? { ...decision, exito } : decision));

    fetch(`http://localhost:3000/decisiones/editar/exito/${id}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ exito }),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        console.log("Estado de éxito cambiado, status:", res.status);
      })
      .catch(err => {
        console.error("Error al actualizar el estado de éxito:", err);
      });
  };

  return (
    <div className="contenedor">
  <h2>Agregar Nueva Decisión</h2>
  <input
    value={nuevaDecision}
    onChange={(e) => setNuevaDecision(e.target.value)}
    placeholder="Escribe una decisión..."
  />
  <button className="boton-tomar" onClick={agregarDecision}>+ Añadir decisión</button>

  <div className="contenedor-cards">
    {decisiones.map(({ id, texto, resultado, exito }) => (
      <div key={id} className="decision-card">
        <input
          value={typeof texto === 'string' ? texto : ''}
          onChange={(e) => actualizarDecisionTexto(id, { texto: e.target.value })}
          className="decision-text"
        />

        <div className="decision-result">
          {resultado && resultado.includes("http") ? (
            <img
              src={resultado}
              alt="Esperando decisión..."
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          ) : (
            <strong>{resultado}</strong>
          )}
        </div>

        <div className="bottom-section">
          <div className="buttons-container">
            <button
              className="boton-tomar"
              onClick={() =>
                actualizarResultado(id, Math.random() < 0.5 ? gifHazlo : gifNoLoHagas)
              }
            >
              Tomar Decisión
            </button>
            <button
              className="boton-borrar"
              onClick={() => borrarDecision(id)}
            >
              Borrar
            </button>
          </div>
        </div>

        <div className="toggle-container">
          <label>¿Salió bien?</label>
          <button
            className={exito === true ? "activo" : ""}
            onClick={() => actualizarExito(id, true)}
          >
            Sí
          </button>
          <button
            className={exito === false ? "activo" : ""}
            onClick={() => actualizarExito(id, false)}
          >
            No
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}

export default Decisiones;









