import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyChgx6nxQyIyCNzlV2RwRXDWggObciog00",
    authDomain: "the-ultimate-todo-list.firebaseapp.com",
    databaseURL: "https://the-ultimate-todo-list.firebaseio.com",
    projectId: "the-ultimate-todo-list",
    storageBucket: "the-ultimate-todo-list.appspot.com",
    messagingSenderId: "387158845370",
    appId: "1:387158845370:web:78a3c18e97ec00eaf6df83",
    measurementId: "G-VR9K8DXBTQ"
};
firebase.initializeApp(config);
const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todos")