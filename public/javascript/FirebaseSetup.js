/*eslint-disable */
var firebaseConfig = {
    apiKey: "AIzaSyCKghNDOPOufY-8SYVGW4xpOeZC3fDVZko",
    authDomain: "theory-parking.firebaseapp.com",
    databaseURL: "https://theory-parking.firebaseio.com",
    projectId: "theory-parking",
    storageBucket: "theory-parking.appspot.com",
    messagingSenderId: "192548003681",
    appId: "1:192548003681:web:1f092e58a62891359caf20",
    measurementId: "G-D9YWC0BFVD"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
firebase.analytics();
var auth = firebase.auth();
var database = firebase.firestore();
var storage = firebase.storage();
var user = firebase.auth().currentUser;
