// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import {getAuth, GoogleAuthProvider} from "firebase/auth"
   //IST FIREBASE DATABASE
// const firebaseConfig = {
//     apiKey: "AIzaSyD65fYsKiMA7IIHqbBMwoL1XRMqsfwIBrE",
//     authDomain: "drag-and-drop-image-gall-4871e.firebaseapp.com",
//     projectId: "drag-and-drop-image-gall-4871e",
//     storageBucket: "drag-and-drop-image-gall-4871e.appspot.com",
//     messagingSenderId: "302608566707",
//     appId: "1:302608566707:web:b1b42a446b2360d932e3c6",
//     measurementId: "G-L4G9Z71NZH"
//   };

//SECOND DATABASE
const firebaseConfig = {
  apiKey: "AIzaSyApVaUhGgYDbHLLgGphBR3XdMEl8Ga2h2k",
  authDomain: "image-gallery2-85323.firebaseapp.com",
  projectId: "image-gallery2-85323",
  storageBucket: "image-gallery2-85323.appspot.com",
  messagingSenderId: "473668388590",
  appId: "1:473668388590:web:566b0bce94426b07c355ff",
  measurementId: "G-7LVWK49RKE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider();

export const database = getFirestore(app)
export const firestore = getStorage(app)