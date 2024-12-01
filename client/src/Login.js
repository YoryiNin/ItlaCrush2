import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Importar el método de autenticación
/*import './Login.css'; // Estilos específicos para el formulario de Login*/
import './styles.css'; // Importar archivo CSS para los estilos

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth(); // Obtén la referencia de auth
      await signInWithEmailAndPassword(auth, email, password); // Realiza el inicio de sesión
      setError(""); // Limpiar el error si el inicio de sesión es exitoso
    } catch (err) {
      setError("Error de inicio de sesión: " + err.message); // Mostrar error en caso de fallo
    }
  };

  return (
    <div className="login-form">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>} {/* Muestra el error si existe */}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;

