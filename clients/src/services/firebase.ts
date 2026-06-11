import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAM9dhjZTvC1QnEGy7I0m-S8QTt_luMiPI",
  authDomain: "ride-app-f956c.firebaseapp.com",
  databaseURL:
    "https://ride-app-f956c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ride-app-f956c",
  storageBucket: "ride-app-f956c.firebasestorage.app",
  messagingSenderId: "855465048830",
  appId: "1:855465048830:web:d02a566a1f14ec640ac3af",
  measurementId: "G-6WVE5JGJ1D",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
