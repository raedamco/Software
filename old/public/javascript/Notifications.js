/*eslint-disable */
//
//  Notifications.js
//  Raedam 
//
//  Created on 1/17/2020. Modified on 6/30/2020 by Omar Waked.
//  Copyright © 2020 Raedam. All rights reserved.
//
// DESCRIPTION OF FILE

function customerSignUp(Product){
    Swal.fire({
        title: "Enter your email",
        input: 'email',
        showCancelButton: true,
        closeButtonAriaLabel: true,
    }).then((result) => {
        if (result.value != null){
            addToDatabase(result.value, Product);
        }
    });
}

var timeStamp = firebase.firestore.Timestamp.fromDate(new Date());

function addToDatabase(Email, Product){
    database.collection('Waitlist').doc(Email).get().then(function(doc) {
        if (doc.exists) {
            let existingProducts = doc.data()["Product"]; 
            if (existingProducts.includes(Product)){
                showError("You are already on the notification list for this product.");
            }else{
                existingProducts.push(Product);
                database.collection('Waitlist').doc(Email).set({
                    'Email': Email,
                    'Product': existingProducts,
                    'Time': timeStamp
                }).then(function () {
                     showSuccess(Product);
                }).catch(function (error) {
                    showError(error);
                });  
            }
        }else{
            database.collection('Waitlist').doc(Email).set({
                'Email': Email,
                'Product': [Product],
                'Time': timeStamp
            }).then(function () {
                 showSuccess(Product);
            }).catch(function (error) {
                showError(error);
            }); 
        }
    }).catch(function(error) {
        showError(error);
    });
    
}

function showSuccess(Product){
    Swal.fire({
      title: "Success",
      text: "We will send you with updates regarding the " + "\n" + Product + " sensor",
      icon: "success",
      confirmButtonText: "Close"
    })
}

function showError(error){
    Swal.fire({
      title: "Error",
      text: error,
      icon: "error",
      confirmButtonText: "Close"
    })
}