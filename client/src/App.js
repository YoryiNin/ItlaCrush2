import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DeclaracionForm from "./DeclaracionForm";
import Declaraciones from "./Declaraciones";
import Register from "./Register";
import Login from "./Login";
import './styles.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Actualiza el estado con el usuario autenticado o null
    });

    return () => unsubscribe(); // Limpia el listener al desmontar
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>ITLA Crush</h1>
      </header>

      <div className="content">
        {/* Caja de declaraciones con scroll bar */}
        <div className="declarations-container">
          <Declaraciones />
        </div>

        {/* Opciones adicionales según el estado de autenticación */}
        {!user ? (
          <div className="auth-container">
            <h2>Bienvenido</h2>
            <p>Inicia sesión o regístrate para interactuar más.</p>
            <div className="auth-box">
              <Login />
              <Register />
            </div>
          </div>
        ) : (
          <div className="user-container">
            <h2>Hola, {user.displayName || "Usuario"}</h2>
            <DeclaracionForm />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

