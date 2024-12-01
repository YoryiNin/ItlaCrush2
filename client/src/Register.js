import React, { useState } from "react";
import { auth, db } from "./firebaseConfig"; // Importamos Firestore (db)
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Importamos las funciones para guardar en Firestore
import './styles.css'; // Importar archivo CSS para los estilos

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState(""); // Agregamos estado para el nombre de usuario
  const [firstName, setFirstName] = useState(""); // Agregamos estado para el nombre
  const [lastName, setLastName] = useState(""); // Agregamos estado para el apellido
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Primero, creamos el usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizamos el perfil del usuario en Firebase Authentication
      await updateProfile(user, {
        displayName: userName, // Asignamos el nombre de usuario al perfil
      });

      // Guardamos el nombre, apellido y usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: firstName,
        apellido: lastName,
        usuario: userName,
        email: email,
      });

      setEmail("");
      setPassword("");
      setUserName("");
      setFirstName("");
      setLastName(""); // Limpiamos todos los campos
      setError("");
      alert("¡Usuario registrado exitosamente!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)} // Manejamos el estado del nombre
              required
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)} // Manejamos el estado del apellido
              required
            />
          </div>
          <div>
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} // Manejamos el estado del nombre de usuario
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Registrar</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Register;
