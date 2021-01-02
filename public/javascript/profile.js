//
//  profile.js
//  Raedam 
//
//  Created on 8/26/2020. Modified on 11/10/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for profile page 
var PSU_profile = false;
var commuter_profile = false;
function displayUserBox(username, role)
{
         var profile_box = document.getElementById("profile-box");
         profile_box.style.position = "relative";
         profile_box.style.top = "-50px";
         profile_box.style.bottom = "auto";
         profile_box.style.height = "350px";
         profile_box.style.border = "2px solid #a1a1a1";
                
         var edit_box = document.getElementById("edit");
         edit_box.style.position = "absolute";
         edit_box.style.right = "30px";
                
         var edit_img = document.createElement("img");
         edit_img.style.position = "absolute";
         edit_img.src = 'images/edit.svg';
         edit_img.width = "30";
         edit_img.height ="30";
         edit_img.onclick = function(){profilePopup();}
         edit_box.appendChild( edit_img);
                
         var profile_pic_elem = document.createElement("img");
         profile_pic_elem.style.padding ="20px"
         profile_pic_elem.src = 'images/profile.svg'; // placeholder image look into profile pictures
         profile_pic_elem.width ="190";
         profile_pic_elem.height ="190";
         document.getElementById("profile-picture").appendChild(profile_pic_elem);
               
         document.getElementById("name").innerHTML = username;
                
         var role_div =   document.getElementById("role");
         role_div.style.color="#a1a1a1";
         role_div.innerHTML = role;
}

function displayAccountData(){
 /* "Users" "Commuters"*/
    var username;
    var role;
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
        
            database.collection("Users").doc("Companies").collection("Portland State University").where("UUID", "==", user.uid).get().then(function(querySnapshot) {
                    var counter = 0;     
                    querySnapshot.forEach(function(doc) {
                    counter +=1;
                    username = doc.data().Name;
                    role = doc.data().Role;
                    if(username == undefined)
                        {
                            username = "First Name Last Name"
                            console.log("undefined result")
                        }
                });
                  if(counter == 0)
                    {
                       
                        displayCommutersData();
                       commuter_profile = true;
                    }
                else
                    {
                        displayUserBox(username,role);
                        PSU_profile = true;
                        //document.getElementById("name").innerHTML = "Hello, <br><br>" + username;
              
                    }
                
            }).catch(function(error) {
                alert("Error getting documents: " + error);
            });
        }else{
            signOut();
        }
    });
}
function displayCommutersData(){
   /* "Users" "Commuters"*/
    var username;
    var role;
 
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
        
         
            database.collection("Users").doc("Commuters").collection("Users").where("UUID", "==", user.uid).get().then(function(querySnapshot) {
                
                querySnapshot.forEach(function(doc) {
                   
                   
                    username = doc.data().Name;
                    role = doc.data().Role;
                    if(username == undefined)
                        {
                            username = "First Name Last Name"
                            console.log("undefined result")
                        }
                      if(role == undefined)
                        {
                            role = "user"
                            console.log("undefined result")
                        }
                });
                displayUserBox(username,role);
               
         // document.getElementById("name").innerHTML = "Hello, <br><br>" + username + role;
            }).catch(function(error) {
                alert("Error getting documents: " + error);
            });
        }else{
            signOut();
        }
    });
             
}
 function setName(name)
{              
       firebase.auth().onAuthStateChanged(function(user) {
        if(user) 
        {
            if(commuter_profile == true)
            {
                database.collection("Users").doc("Commuters").collection("Users").doc(user.uid).update({
                         "Name" : name
                     }).then(function() 
                {
                         //update name on screen
                    document.getElementById("name").innerHTML = name;
                    Swal.fire({  
                    title: "Success",
                    text: "Name has been updated to " + name,
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
            else if(PSU_profile == true)
            {
                   database.collection("Users").doc("Companies").collection("Portland State University").doc(user.uid).update({
                         "Name" : name
                     }).then(function() 
                {
                         //update name on screen
                    document.getElementById("name").innerHTML = name;
                    Swal.fire({  
                    title: "Success",
                    text: "Name has been updated to " + name,
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
                
               
        }else{
            signOut();
        }
    });
            
            
        
}
function profilePopup(){
    const { value: Double } = Swal.fire({
      input: 'text',
      inputPlaceholder: 'Enter your Name',
      inputValidator: (value) => {
        if (!value) {
            return 'You need to write something!'
        }else{
            //price_submit(value);
            setName(value);
        }
      }
    })
}