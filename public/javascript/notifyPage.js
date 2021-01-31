//  Notifications.js
//  Raedam 
//
//  Created on 1/17/2021. Modified on 1/30/2021 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// In progress notification system setup and testing

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