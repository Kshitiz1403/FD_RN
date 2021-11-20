// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import { firebaseConfig } from "./firebaseConfig";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
let app
if (firebase.apps.length == 0) {
    app = firebase.initializeApp(firebaseConfig);
}
else{
    app = firebase.app()
}

const auth = firebase.auth()

const firestore = firebase.firestore()

export {auth}
export {firestore}