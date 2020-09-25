//
//  price.js
//  Raedam 
//
//  Created on 8/26/2020. Modified on 9/24/2020 by Austin Mckee.
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
//        var title_div = document.createElement("div");
//    title_div.style.width= "250px";
//    var title = document.createElement("h3");
//    var name = document.createTextNode("Parking Structure 1");
//   title.style.color = "black";
//    title.style.textAlign= "left";
//    title.appendChild(name);
//     title_div.appendChild(title);
//   
//    title_div.setAttribute("id","price_title");
    // div for price form
    
    
    
   
    
    // price_div.appendChild(price);
  
    
    var the_div = document.getElementById("coming_soon");
   // the_div.appendChild(title_div);
   
    
    //table settings and creation
    var price_table = document.createElement("TABLE");
    the_div.appendChild(price_table);
    price_table.style.fontSize = "24px";
    price_table.style.color = "black";
    price_table.style.border = "1";
    price_table.id="price_table";
    price_table.style.borderCollapse = "separate";
     price_table.style.borderSpacing = "20px";
    
    // first row
    var row1 = price_table.insertRow(0);
    
    // structure label
    var cell1 = row1.insertCell(0);
    cell1.innerHTML = "Parking Structure 1";
    
    // price input
    var price = document.createElement("input");
    price.setAttribute("type","number");
    price.setAttribute("step","0.05");
    price.value = the_price ;//await Number(current_value);
    price.style.color = "black";
    price.style.fontSize = "14px";
    price.style.width = "70px"
    var cell2 = row1.insertCell(1);
    
    var input_table = document.createElement("TABLE");
    var inputrow = input_table.insertRow(0);
    var inputcell = inputrow.insertCell(0);
    inputcell.appendChild(price);
    var inputcell2 = inputrow.insertCell(1);
    inputcell2.innerHTML="/min";
    cell2.appendChild(input_table);
  
//    var the_p = document.createElement("p");
//    var the_p_words = document.createTextNode("/min");
//    cell2.appendChild(the_p);
//    the_p.appendChild(the_p_words);
    
}
