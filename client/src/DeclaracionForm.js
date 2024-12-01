import { useEffect, useState } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import './styles.css'; // Importar archivo CSS para los estilos

const DeclaracionForm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatario, setDestinatario] = useState("");
  const [destinatarioManual, setDestinatarioManual] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [publica, setPublica] = useState(false); // Por defecto no está marcado el checkbox público
  const [esPrivado, setEsPrivado] = useState(false); // Por defecto no está marcado el checkbox privado
  const [esAnonimo, setEsAnonimo] = useState(false); // Nuevo estado para el checkbox anónimo
  const [mensajeError, setMensajeError] = useState(""); // Mensaje de error si no se selecciona ningún checkbox
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = [];
        querySnapshot.forEach((doc) => {
          usuariosData.push(doc.data().nombre);
        });
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Has cerrado sesión.");
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación para asegurar que al menos uno de los checkboxes esté marcado
    if (!publica && !esPrivado && !esAnonimo) {
      setMensajeError("¡Debes seleccionar al menos un checkbox: 'Público', 'Privado' o 'Anónimo'!");
      return;
    } else {
      setMensajeError(""); // Limpiar mensaje de error si pasa la validación
    }

    const destinatarioFinal = destinatario === "OTRO" ? destinatarioManual : destinatario;

    if (!destinatarioFinal.trim() || !cuerpo.trim()) {
      alert("El destinatario y el cuerpo de la declaración son obligatorios.");
      return;
    }

    // Verificar si el usuario está autenticado y asignar el autor correctamente
    const autor = esAnonimo ? "Anónimo" : (user ? user.displayName : "Usuario registrado");

    try {
      await addDoc(collection(db, "declaraciones"), {
        autor,
        destinatario: destinatarioFinal.trim(),
        cuerpo: cuerpo.trim(),
        publica,
        privado: esPrivado, // Guardamos si el mensaje es privado
        anonimo: esAnonimo, // Guardamos si el mensaje es anónimo
        fecha: new Date(),
      });

      // Resetear el formulario después del envío
      setDestinatario("");
      setDestinatarioManual("");
      setCuerpo("");
      setPublica(false);
      setEsPrivado(false);
      setEsAnonimo(false);

      alert("Tu declaración ha sido enviada.");
      window.location.href = "/declaraciones"; // Redirigir si es necesario
    } catch (error) {
      console.error("Error al enviar la declaración:", error);
      alert("Ocurrió un error al enviar tu declaración.");
    }
  };

  return (
    <div className="declaracion-form-container">
      {user ? (
        <p>Estás autenticado como: <strong>{user.displayName || "Usuario registrado"}</strong></p>
      ) : (
        <p>Estás enviando declaraciones como <strong>Anónimo</strong>.</p>
      )}
      <form onSubmit={handleSubmit} className="declaracion-form">
        <h2>Hacer una declaración</h2>
        <select
          value={destinatario}
          onChange={(e) => {
            setDestinatario(e.target.value);
            if (e.target.value !== "OTRO") {
              setDestinatarioManual("");
            }
          }}
          required
        >
          <option value="">Selecciona un destinatario</option>
          {usuarios.map((usuario, index) => (
            <option key={index} value={usuario}>
              {usuario}
            </option>
          ))}
          <option value="OTRO">Otro</option>
        </select>
        {destinatario === "OTRO" && (
          <input
            type="text"
            placeholder="Escribe el nombre de tu crush"
            value={destinatarioManual}
            onChange={(e) => setDestinatarioManual(e.target.value)}
            required
            className="manual-destinatario"
          />
        )}
        <textarea
          placeholder="Escribe tu declaración"
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
          required
        ></textarea>
        <label>
          Pública:
          <input
            type="checkbox"
            checked={publica}
            onChange={(e) => setPublica(e.target.checked)}
          />
        </label>
        <label>
          Privada:
          <input
            type="checkbox"
            checked={esPrivado}
            onChange={(e) => setEsPrivado(e.target.checked)}
          />
        </label>
        <label>
          Anónimo:
          <input
            type="checkbox"
            checked={esAnonimo}
            onChange={(e) => setEsAnonimo(e.target.checked)}
          />
        </label>
        {mensajeError && <p className="error-message">{mensajeError}</p>} {/* Mostrar mensaje de error */}

        <button type="submit">Enviar</button>
      </form>
      <button onClick={handleLogout} className="logout-button">
        Salir
      </button>
    </div>
  );
};

export default DeclaracionForm;
