// Fix: Use Firebase v8 namespaced API due to build errors with v9 modular imports.
// Fix: Update imports to use the v9 compat library for v8 syntax support.
// Fix: Corrected firebase imports to use the compat library, providing the v8 namespaced API.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/functions";
import "firebase/compat/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1z_aGy2bKle5ASO6e6tLwE97WtxSrZkY",
  authDomain: "aistudiocareercopilot.firebaseapp.com",
  projectId: "aistudiocareercopilot",
  storageBucket: "aistudiocareercopilot.appspot.com",
  messagingSenderId: "43866573431",
  appId: "1:43866573431:web:2a7bc8f4f11ffeeb925472"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


// Get Firebase services
export const auth = firebase.auth();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const db = firebase.firestore();