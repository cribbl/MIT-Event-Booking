import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAhKIXmaPGeHw_7hX9qfjGecaLCGsLDn4g",
    authDomain: "mit-clubs-management.firebaseapp.com",
    databaseURL: "https://mit-clubs-management.firebaseio.com",
    projectId: "mit-clubs-management",
    storageBucket: "mit-clubs-management.appspot.com",
    messagingSenderId: "330445707440"
  };

firebase.initializeApp(config);

export const firebaseDB = firebase.database();
export const firebaseAuth = firebase.auth();
export const firebaseMessaging = firebase.messaging();
export const storage = firebase.storage();

// firebaseAuth.onAuthStateChanged(function(user) {
//     ;
//     if (user) {
//       return function(dispatch) {
//         dispatch(login(user))
//         console.log('user exists')
//       } 
//       function login(user) { return {type: "SUCCESS_LOGIN", user}}
//     } 
//     else {
//       console.log('user dne')
//       return
//     }
//   });