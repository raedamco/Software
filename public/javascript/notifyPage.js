//  Notifications.js
//  Raedam
//
//  Created on 1/17/2021. Modified on 1/30/2021 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// In progress notification system setup and testing

//const { get } = require("core-js/fn/dict");

const messaging = firebase.messaging();
// messaging
//   .requestPermission()
//   .then(function () {
//     console.log("have permission");
//     return messaging.getToken({
//       vapidKey:
//         "BCoBL38Noyfzy4R_pMtKggRD8foKriG7dCYizWO7rr1D6Hli-LSNfGMmvLXtWaPLEitd1GWcTb-cbGwaybksVZ8",
//     });
//   })
//   .then(function (token) {
//     console.log(token);
//   })
//   .catch(function (err) {
//     console.log("Error: " + err);
//   });
//user = firebase.auth();
async function getCurrentUser(auth) {
  return await auth.currentUser;
}
messaging
  .getToken({
    vapidKey:
      "BCoBL38Noyfzy4R_pMtKggRD8foKriG7dCYizWO7rr1D6Hli-LSNfGMmvLXtWaPLEitd1GWcTb-cbGwaybksVZ8",
  })
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      const auth = firebase.auth();
      getCurrentUser(auth).then((currentUser) => console.log(currentUser));

      console.log(currentToken);
      console.log(auth);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
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
