importScripts("https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.2.1/firebase-messaging.js");

var firebaseConfig = {
  apiKey: "AIzaSyCKghNDOPOufY-8SYVGW4xpOeZC3fDVZko",
  authDomain: "theory-parking.firebaseapp.com",
  databaseURL: "https://theory-parking.firebaseio.com",
  projectId: "theory-parking",
  storageBucket: "theory-parking.appspot.com",
  messagingSenderId: "192548003681",
  appId: "1:192548003681:web:1f092e58a62891359caf20",
  measurementId: "G-D9YWC0BFVD",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// messaging.onMessage(function (payload) {
//   console.log("onMessage", payload);
//   console.log(payload.notification);
//   const title = payload.notification.title;
//   const message = payload.notification.body;
//   createMessage(title, message);
// });
