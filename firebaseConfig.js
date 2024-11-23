// Importa las funciones necesarias de los SDKs que necesitas
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase para tu app web
const firebaseConfig = {
  apiKey: "AIzaSyD2IkUYt7-_l7a6Dw90u-IMMweSwuNt83k",
  authDomain: "appbase-50f50.firebaseapp.com",
  projectId: "appbase-50f50",
  storageBucket: "appbase-50f50.appspot.com", // Asegurarse que sea appspot.com
  messagingSenderId: "23470984006",
  appId: "1:23470984006:web:4e8e1152e916787e597347",
};

// Inicializa Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
