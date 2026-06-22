import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. IMPORTA STORAGE

const firebaseConfig = {
  apiKey: "AIzaSyAgw6XxPJ4n_78SpxJbZYklO4uhyYZ1sww",
  authDomain: "derma-wiki-app-m.firebaseapp.com",
  projectId: "derma-wiki-app-m",
  storageBucket: "derma-wiki-app-m.firebasestorage.app",
  messagingSenderId: "119919345548",
  appId: "1:119919345548:web:787284f4244a304d67a0a9",
  measurementId: "G-LC3999KW26"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app); // 2. EXPORTA STORAGE