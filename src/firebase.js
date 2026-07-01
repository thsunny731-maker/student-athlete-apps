import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVGwkWl7LDWwmDEFEQwtoea9SmHDuJNEw",
  authDomain: "student-athlete-apps.firebaseapp.com",
  projectId: "student-athlete-apps",
  storageBucket: "student-athlete-apps.firebasestorage.app",
  messagingSenderId: "24852461745",
  appId: "1:24852461745:web:30f8c215bed4ab6bad8a90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
