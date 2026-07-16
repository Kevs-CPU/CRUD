import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsjFQH0HE4SzTudrvvsG8Z1K5AoKGqWSo",
  authDomain: "theory-10f57.firebaseapp.com",
  projectId: "theory-10f57",
  storageBucket: "theory-10f57.firebasestorage.app",
  messagingSenderId: "272243860654",
  appId: "1:272243860654:web:c3b36ade3bc209c30f393f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;