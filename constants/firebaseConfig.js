// constants/firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6qfsmrfdXQdwOWm5idZvmH2Qv2ReT0jM",
  authDomain: "purebite-85703.firebaseapp.com",
  projectId: "purebite-85703",
  storageBucket: "purebite-85703.appspot.com",
  messagingSenderId: "930876496502",
  appId: "1:930876496502:web:2c35120fdc0e51b3011d57"
};

// Verifica si ya hay aplicaciones inicializadas
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();
const db = getFirestore();

export { auth, db };
