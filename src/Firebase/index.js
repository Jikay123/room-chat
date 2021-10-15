import firebase from "firebase"
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDl1aUzEJ0Eq7LYwlyniblbJKmAVWCOrwI",
    authDomain: "chat-room-ba893.firebaseapp.com",
    projectId: "chat-room-ba893",
    storageBucket: "chat-room-ba893.appspot.com",
    messagingSenderId: "49344946768",
    appId: "1:49344946768:web:31c6b02ea7b614fbd92755",
    measurementId: "G-N2KXF4BLZ2"
});
const db = firebaseApp.firestore();
export const analytics = firebase.analytics();
export const auth = firebase.auth();
export const storage = firebase.storage();

export default db;