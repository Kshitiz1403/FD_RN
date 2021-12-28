// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
// let app
// if (firebase.apps.length == 0) {
//     app = initializeApp(firebaseConfig);
// }
// else{
//     app = app()
// }

initializeApp(firebaseConfig)

const firestore = getFirestore()
const auth = getAuth()

export { auth }
export { firestore }