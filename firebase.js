
// ================================
// 30Days - firebase.js
// ================================

const firebaseConfig = {
  apiKey: "AIzaSyCglYeFkrMIefIdNMu1J2o-kYfhCweBMlU",
  authDomain: "days-51e9b.firebaseapp.com",
  databaseURL: "https://days-51e9b-default-rtdb.firebaseio.com",
  projectId: "days-51e9b",
  storageBucket: "days-51e9b.firebasestorage.app",
  messagingSenderId: "977450547936",
  appId: "1:977450547936:web:d012b4bb23ddab928c2e85",
  measurementId: "G-CYJLCGCJWB"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();
