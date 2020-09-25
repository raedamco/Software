//
//  price.js
//  Raedam 
//
//  Created on 8/26/2020. Modified on 8/26/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for price adjustment
/*
firebase.auth().onAuthStateChanged(function(user) 
        {
            if(user) 
            {
                database.collection(test.organization).doc(test.parking_structure).collection(test.floor).orderBy("Time","desc").limit(test.data_amount).get().then(async function(querySnapshot) 
                {
                    querySnapshot.forEach(async function(doc)
                    {
                      
                        var price =  doc.data()["Pricing"]["Minute"];
                      
                    });
                  
                }).catch(function(error) 
                {
                    alert("Error getting documents: " + error);
                });
                
                     
            }else
            {
                signOut();
            }
        });
*/

function test_price()
{
  
    var the_database = database.collection("PSU").doc("Parking Structure 1");
the_database.get().then(function(doc) {
    if(doc.exists){
         price = doc.data()["Pricing"]["Minute"];
       
        price_form(price);
           //return price; 
    }else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
         price = null;
        price_form(price);
    }
   
}).catch(function(error) {
    console.log("Error getting document:", error);
});
  
    
}

function price_form(the_price)
{
        var title_div = document.createElement("div");
    title_div.style.width= "250px";
    var title = document.createElement("h3");
    var name = document.createTextNode("Parking Structure 1");
   title.style.color = "black";
    title.style.textAlign= "left";
    title.appendChild(name);
     title_div.appendChild(title);
   
    title_div.setAttribute("id","price_title");
    // div for price form
    
    
    var price = document.createElement("input");
    price.setAttribute("type","number");
     price.setAttribute("step","0.05");
   
    price.value = the_price ;//await Number(current_value);
   price.style.color = "black";
    
    price.style.fontSize = "14px";
    price.style.width = "70px"
    // price_div.appendChild(price);
  
  
    var the_div = document.getElementById("coming_soon");
    the_div.appendChild(title_div);
   
    
    
    var price_table = document.createElement("TABLE");
    the_div.appendChild(price_table);
    price_table.style.fontSize = "24px";
    price_table.style.color = "black";
    price_table.borderSpacing = "20px"
    
    var row1 = price_table.insertRow(0);
    
    var cell1 = row1.insertCell(0);
    cell1.innerHTML = "Parking Structure 1";
    var cell2 = row1.insertCell(1);
    cell1.appendChild(price);
}
