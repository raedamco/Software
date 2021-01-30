// const firebaseConfig = {
//     apiKey: "AIzaSyCKghNDOPOufY-8SYVGW4xpOeZC3fDVZko",
//     authDomain: "theory-parking.firebaseapp.com",
//     databaseURL: "https://theory-parking.firebaseio.com",
//     projectId: "theory-parking",
//     storageBucket: "theory-parking.appspot.com",
//     messagingSenderId: "192548003681",
//     appId: "1:192548003681:web:1f092e58a62891359caf20",
//     measurementId: "G-D9YWC0BFVD"
// };
// firebaseConfig.initializeApp(config);

const messaging = firebase.messaging();
messaging.getToken({ vapidKey: 'BCoBL38Noyfzy4R_pMtKggRD8foKriG7dCYizWO7rr1D6Hli-LSNfGMmvLXtWaPLEitd1GWcTb-cbGwaybksVZ8' }).then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      console.log(currentToken);
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
// messaging.usePubilcVapidKey('BCoBL38Noyfzy4R_pMtKggRD8foKriG7dCYizWO7rr1D6Hli-LSNfGMmvLXtWaPLEitd1GWcTb-cbGwaybksVZ8');
// messaging.requestPermission().then(function(){
//     console.log("have Permission");
// })
// .catch(function(err){
//     console.log('Error Occured');
// })

// messaging.onMessage(function(payload){
//     console.log("onMessage", payload);
// })