import { db } from "./firebaseConfig"; // Importar configuración de Firebase
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Función para agregar declaraciones
export const agregarDeclaracion = async (autor, destinatario, publica, cuerpo) => {
  try {
    const docRef = await addDoc(collection(db, "declaraciones"), {
      autor,
      destinatario,
      publica,
      cuerpo,
      fecha: new Date().toISOString(),
    });
    console.log("Declaración agregada con ID: ", docRef.id);
  } catch (error) {
    console.error("Error al agregar declaración: ", error);
  }
};

// Función para obtener declaraciones públicas
export const obtenerDeclaracionesPublicas = async () => {
  try {
    const q = query(collection(db, "declaraciones"), where("publica", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error al obtener declaraciones públicas: ", error);
  }
};

// Función para obtener declaraciones privadas de un usuario autenticado
export const obtenerDeclaracionesPrivadas = async (usuario) => {
  try {
    const q = query(collection(db, "declaraciones"), where("autor", "==", usuario));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error al obtener declaraciones privadas: ", error);
  }
};
