import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDbCc12UvZ6OmCNywQn04LYA4ACG3Lvazc",
  authDomain: "thebrand-c639e.firebaseapp.com",
  projectId: "thebrand-c639e",
  storageBucket: "thebrand-c639e.firebasestorage.app",
  messagingSenderId: "811229685919",
  appId: "1:811229685919:web:217a804559ad6a2352daaa",
  measurementId: "G-V0N0XGNS5Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
