import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDSIsGYGKwpAR7D5PkOW-Xwwo2Ln9jEF0",
  authDomain: "project-1461d.firebaseapp.com",
  databaseURL: "https://project-1461d-default-rtdb.firebaseio.com",
  projectId: "project-1461d",
  storageBucket: "project-1461d.appspot.com",
  messagingSenderId: "386134303744",
  appId: "1:386134303744:web:1675e95b120c041c1e64e5",
  measurementId: "G-RLHGQ94HRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, analytics, auth, database };
