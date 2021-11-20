// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5xpTIRjYNhsIfoUa6kaU6OveLp5yxPjk",
    authDomain: "food-delivery-6fbf3.firebaseapp.com",
    projectId: "food-delivery-6fbf3",
    storageBucket: "food-delivery-6fbf3.appspot.com",
    messagingSenderId: "657371352578",
    appId: "1:657371352578:web:b15cd7862ca52a102a611b"
};

// Initialize Firebase
let app
if (firebase.apps.length == 0) {
    app = firebase.initializeApp(firebaseConfig);
}
else{
    app = firebase.app()
}

const auth = firebase.auth()

export {auth}