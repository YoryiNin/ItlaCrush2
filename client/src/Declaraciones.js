import React, { useEffect, useState } from "react";
import { db, auth } from "./firebaseConfig"; // Asegúrate de que apunta a tu configuración de Firebase
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import './styles.css'; // Importar archivo CSS para los estilos

const Declaraciones = () => {
  const [declaraciones, setDeclaraciones] = useState([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null); // Nuevo estado para almacenar el usuario autenticado

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioAutenticado(!!user);
      setUsuario(user); // Asignar el usuario autenticado
    });

    return () => unsubscribe(); // Limpiar el listener cuando el componente se desmonte
  }, []);

  useEffect(() => {
    // Cargar declaraciones desde Firestore
    const fetchDeclaraciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "declaraciones"));
        const declaracionesData = [];
        querySnapshot.forEach((doc) => {
          declaracionesData.push({ id: doc.id, ...doc.data() });
        });
        setDeclaraciones(declaracionesData);
      } catch (error) {
        console.error("Error al obtener las declaraciones: ", error);
      }
    };

    fetchDeclaraciones();
  }, []);

  return (
    <div>
      <h1>Declaraciones</h1>
      {declaraciones.map((declaracion) => {
        // Mostrar mensajes públicos y anónimos para todos los usuarios
        if (declaracion.publica || declaracion.autor === "Anónimo" || !declaracion.autor) {
          return (
            <div key={declaracion.id} className="declaracion">
              <p>
                <strong>De:</strong> {declaracion.autor || "Anónimo"}
              </p>
              <p>
                <strong>Para:</strong> {declaracion.destinatario}
              </p>
              <p>{declaracion.cuerpo}</p>
            </div>
          );
        }

        // Mostrar mensaje indicando que el contenido es privado si no está autenticado
        if (declaracion.privado && !usuarioAutenticado) {
          return (
            <div key={declaracion.id} className="declaracion privada">
              <p>Este contenido es privado. Inicia sesión para verlo.</p>
            </div>
          );
        }

        // Mostrar mensajes privados solo a usuarios autenticados
        if (usuarioAutenticado) {
          // Verificar si el usuario es el autor o el destinatario del mensaje privado
          if (declaracion.privado && (declaracion.destinatario === usuario.displayName || declaracion.autor === usuario.displayName)) {
            return (
              <div key={declaracion.id} className="declaracion privada">
                <p>
                  <strong>De:</strong> {declaracion.autor}
                </p>
                <p>
                  <strong>Para:</strong> {declaracion.destinatario}
                </p>
                <p>{declaracion.cuerpo}</p>
              </div>
            );
          }
        }

        // No mostrar mensajes privados a usuarios no autenticados
        return null;
      })}
    </div>
  );
};

export default Declaraciones;
