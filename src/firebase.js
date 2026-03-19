import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDPdRkstZGl-SDwF_fUks2PCD8WATyOoOs",
  authDomain: "scontiassesment.firebaseapp.com",
  databaseURL: "https://scontiassesment-default-rtdb.firebaseio.com",
  projectId: "scontiassesment",
  storageBucket: "scontiassesment.firebasestorage.app",
  messagingSenderId: "900210922636",
  appId: "1:900210922636:web:a6914a94cf736823aa57a9",
  measurementId: "G-HVDCHQ7W83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
