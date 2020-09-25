//
//  price.js
//  Raedam 
//
//  Created on 8/26/2020. Modified on 9/24/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for price adjustment

async function getData() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var title = document.getElementById("structureTitle");
            setAttributes(title,{"id": "structureTitle"}, "Organization Settings");
            database.collection("Companies").where("Info.CUID", "==", "f6KIyH6vyFTTrQ6J6zjaRzlqXN32").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    retrievePricingData();
                });
            }).catch(function(error) {
                alert("Error getting documents: " + error);
            });
        }else{
            signOut();
        }
    });
}

var currentPrice;

function retrievePricingData(){
    database.collection("PSU").doc("Parking Structure 1").get().then(function(doc) {
        if(doc.exists){
            price = doc.data()["Pricing"]["Minute"];
            currentPrice = price;
            setupPage(price);
        }else{
            price = null;
            price_form(price);
        }
   
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function price_submit(price){
    var newPrice = parseFloat(price).toFixed(3);
    database.collection("PSU").doc("Parking Structure 1").update({
        "Pricing.Minute" : parseFloat(newPrice)
    }).then(function() {
        var adjustedRow = document.getElementById("Structure1");
        adjustedRow.innerHTML = "Current pricing rate for Parking Structure 1: $" + newPrice + "/min  (click row to adjust)";
        Swal.fire({
          title: "Success",
          text: "Rate has been updated to " + price.value,
          icon: "success",
          confirmButtonText: "Close"
        })
    }).catch(function(error) {
        Swal.fire({
          title: "Error",
          text: "Error updating rate",
          icon: "error",
          confirmButtonText: "Close"
        })
    });
}

// create table of orangaization's structure and add popup settings modification
function setupPage(currentPrice){
    var container = document.getElementById("container");
    var table = document.createElement('table');
    table.backgroundColor = "red";
    table.id = "OrganizationPricingLabel";
    container.appendChild(table);
    
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.id = "Structure1";

    var rowText = document.createTextNode("Current pricing rate for Parking Structure 1 =  $" + currentPrice + "/min (click row to adjust)");
    td.appendChild(rowText);
    tr.appendChild(td);
    table.appendChild(tr);
    
    onRowClick("OrganizationPricingLabel", function(row){
        popupInput();
    });
}
    
// redirects to object in row's onRowClick function (if it's a structure the sturcuture's/ if it's a floor that floor's) 
function onRowClick(tableId, callback) {
    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        table.rows[i].onclick = function (row) {
            return function () {
                callback(row);
            };
        }
        (table.rows[i]);
    }
};

function popupInput(){
    const { value: Double } = Swal.fire({
      input: 'text',
      inputPlaceholder: 'Enter new rate/minute (Ex: 0.05)',
      inputValidator: (value) => {
        if (!value) {
            return 'You need to write something!'
        }else{
            console.log("VALUE", value);
            price_submit(value);
        }
      }
    })

    
}
