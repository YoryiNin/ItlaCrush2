import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"; // Importa signOut
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-cqS89Di5HkIFbH7YKdLDHRwSgKaIgZ8",
  authDomain: "itla-crush-1e600.firebaseapp.com",
  projectId: "itla-crush-1e600",
  storageBucket: "itla-crush-1e600.firebasestorage.app",
  messagingSenderId: "479715668319",
  appId: "1:479715668319:web:316b26799067015c9986ea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signOut }; // Exporta signOut
