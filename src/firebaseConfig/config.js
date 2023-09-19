// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyD65fYsKiMA7IIHqbBMwoL1XRMqsfwIBrE",
    authDomain: "drag-and-drop-image-gall-4871e.firebaseapp.com",
    projectId: "drag-and-drop-image-gall-4871e",
    storageBucket: "drag-and-drop-image-gall-4871e.appspot.com",
    messagingSenderId: "302608566707",
    appId: "1:302608566707:web:b1b42a446b2360d932e3c6",
    measurementId: "G-L4G9Z71NZH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider();

export const database = getFirestore(app)
export const firestore = getStorage(app)