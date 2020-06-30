/// FOR OMAR PLEASE FILL IN HEADER AND COMMENT FILE SIMILAR TO HOW DATA.JS IS DONE
//
//  Account.js
//  Raedam 
//
//  Created on FILL IN. Modified on FILL IN by FILL IN.
//  Copyright © 2020 Raedam. All rights reserved.
//
// DESCRIPTION OF FILE



/*eslint-disable */
/* SIGNUP INFO START */
function termsCondictions() {

    var popupContainer = document.createElement("container");
    setAttributes(popupContainer, {"class": "popup-container-terms", "id": "popup-container"});

    var termsconditions = document.createElement("text");
    setAttributes(termsconditions, {"class": "popup-termsconditions", "id": "termsconditions"}, "Terms and conditions");


    var overlay = document.createElement("overlay");
    setAttributes(overlay, {"class": "overlay", "id": "overlay"});


    var closeButton = document.createElement("button");
        setAttributes(closeButton, {"class": "btn", "type": "submit"}, "Close");
        closeButton.onclick = function() 
        {
            // Send updated settings then dimiss popup or alert enforcmenet about issue 
            removeNode("overlay");
        }


    popupContainer.appendChild(termsconditions);
    popupContainer.appendChild(closeButton);
    overlay.appendChild(popupContainer);
    document.body.appendChild(overlay);
}

function submitContact() {
    window.alert("Thank you for your inquiry, We will reach out shortly.");
}
/* SIGNUP INFO END */


/* GOOGLE MAPS & PLACES START */
function initMap() {
    var officeLocation = {lat: 45.502470, lng: -122.674940};
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: officeLocation, mapTypeControl: false, streetViewControl: false});
    
    var marker = new google.maps.Marker({position: officeLocation, map: map});
    
}
/* GOOGLE MAPS & PLACES END */



/* JAVASCRIPT FUNCTIONS SIMPLIFIER START */
//Set multipule DOM attributes at once
function setAttributes(el, attrs, text) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }

    if (text) {
        el.innerHTML = text;
    }
}

//Remove nodes from parent
function removeNode(node) {
    document.getElementById(node).remove();
}

function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
/* JAVASCRIPT FUNCTIONS SIMPLIFIER END */
