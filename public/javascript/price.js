//
//  price.js
//  Raedam 
//
//  Created on 8/26/2020. Modified on 1/30/2021 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for price adjustment

/** Gets data from firebase  */
async function getData() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
           
            var title = document.getElementById("structureTitle");
            setAttributes(title,{"id": "structureTitle"}, "Organization Settings");
            database.collection("Companies").where("Info.CUID", "==", "F2h875E6RUhVikpzPhhix1TuEN83").get().then(function(querySnapshot) {
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
// path updated
/** gets price from database for a specific structure */
function retrievePricingData(){
    
    database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").get().then(function(doc) {
        if(doc.exists){
           // console.log(doc.data());
            let currentUnit = doc.data()["Pricing"]["CurrentUnit"];
            switch(currentUnit)
            {
                case "Hour":
                 price = doc.data()["Pricing"]["Hour"];
                 break;
                case "Minute":
                 price = doc.data()["Pricing"]["Minute"];
                 break;
                case "Day":
                 price = doc.data()["Pricing"]["Day"];
                break;
            }
            
           //.Pricing.Minute;//["Minute"];
            console.log(price)
            currentPrice = price;
            setupPage(price,currentUnit);
        }else{
            price = null;
            price_form(price);
        }
   
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}
/**
 * updates price and unit for selected structure 
 * @param {number} price number representing price for x unit of time
 * @param {string} unit unit of time used with above price
 */
function price_submit(price,unit){
   
    var newPrice = parseFloat(price).toFixed(2);
   // var test =  database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1"); //path updated
    //console.log(test);
    let updateValue;
    if(unit == "Minute")
       {
           updateValue = database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").update({
       
             "Pricing.Minute" : parseFloat(newPrice),
               "Pricing.CurrentUnit" : unit
        })
        }
        else if(unit == "Day")
       {
            updateValue = database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").update({
            "Pricing.Day" : parseFloat(newPrice),
               "Pricing.CurrentUnit" : unit
           })
       }
       else if(unit == "Hour")
       {
            updateValue = database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").update({
            "Pricing.Hour" : parseFloat(newPrice),
               "Pricing.CurrentUnit" : unit
        })
       }
        
        updateValue.then(function() {
        var adjustedRow = document.getElementById("Structure1");
        adjustedRow.innerHTML = "Current pricing rate for Parking Structure 1: $" + newPrice + "/" +unit+  "(click row to adjust)";
        Swal.fire({
          title: "Success",
          text: "Rate has been updated to " + price,//price.value,
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
/**
 * create table of orangaization's structure and add popup settings modification
 * @param {number} currentPrice current price per unit of time ex 0.05 per min
 * @param {string} currentUnit unit of time for current price ex 0.05 per Hour
 */
function setupPage(currentPrice,currentUnit){
    var container = document.getElementById("container");
    var table = document.createElement('table');
    table.backgroundColor = "red";
    table.id = "OrganizationPricingLabel";
    container.appendChild(table);
    
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.id = "Structure1";

    var rowText = document.createTextNode("Current pricing rate for Parking Structure 1 $" + currentPrice + "/"+ currentUnit+"(click row to adjust)");
    td.appendChild(rowText);
    tr.appendChild(td);
    table.appendChild(tr);
    
    onRowClick("OrganizationPricingLabel", function(row){
        popupInput();
    });
}
    
// 
/**
 * redirects to object in row's onRowClick function (if it's a structure the sturcuture's/ if it's a floor that floor's) 
 * @param {number} tableId used for table element id of html document object
 * @param {function} callback redirects to object in row's onRowClick function (if it's a structure the sturcuture's/ if it's a floor that floor's) 
 */
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

//function popupInput(){
//    const { value: Double } = Swal.fire({
//      input: 'text',
//      inputPlaceholder: 'Enter new rate',
//      inputValidator: (value) => {
//        if (!value) {
//            return 'You need to write something!'
//        }else{
//            price_submit(value);
//        }
//      }
//    })
//}

/**
 * function that creates pop interface for user to input price and unit selection
 */
function popupInput(){
    (async () => {
  const { value: formValues } = await Swal.fire({
   

    html:
         '<label class = "price-label" for="price-unit"> Price </label></br></br>'+ 
      '<input type = number id="price" min ="0.01" step ="0.01" value ="0.01"  ></br></br>' +
      '<label class = "price-label" for="price-unit"> Unit </label>'+
      '<select id="price-unit" >'+
      '<option value="Minute"> Minute </option>' +
         '<option value="Day"> Day </option>' +
       '<option value="Hour"> Hour </option>'
      +  '</select>',
          
    focusConfirm: false,
      
    preConfirm: () => {
      return [
        document.getElementById('price').value,
        document.getElementById('price-unit').value
      ]
    }
  })
  
    
        

  if (formValues) {
      console.log(formValues)
      if(formValues[0] > 0)
          {
              price_submit(formValues[0],formValues[1]);
          }
      else
          {
              console.log("darn")
          }
    //Swal.fire(JSON.stringify(formValues))
  }

  })()
}