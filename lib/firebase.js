// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; // Certifique-se de importar as funções de autenticação
import firebaseConfig from '../config/firebase.config';

// Inicializa o Firebase apenas se ainda não foi inicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Inicialize o serviço de autenticação

export { firestore, storage, auth, signInWithEmailAndPassword, onAuthStateChanged }; // Exporte a constante 'auth' e as funções