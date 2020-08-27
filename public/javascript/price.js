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
        console.log("Price: ", doc.data()["Pricing"]["Minute"])
    }else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
}

function price_form()
{
    var title_div = document.createElement("div");
    title_div.style.width= "250px";
    var title = document.createElement("h3");
    var name = document.createTextNode("Parking Structure 1");
   title.style.color = "black";
    title.style.textAlign= "left";
    title.appendChild(name);
     title_div.appendChild(title);
    
    var price_div =document.createElement("div");
     price_div.style.width= "250px";
    var price = document.createElement("input");
    price.setAttribute("type","text");
   price.style.color = "black";
    price.style.textAlign= "left";
    price.style.fontSize = "14px";
     price_div.appendChild(price);
    price_div 
    var the_div = document.getElementById("coming_soon");
    the_div.appendChild(title_div);
     the_div.appendChild(price_div);
}
