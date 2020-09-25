/* eslint-disable */
//
//  htmlElements.js
//  Raedam 
//
//  Created on 10/25/2019. Modified on 6/30/2020 by Omar Waked.
//  Copyright © 2020 Raedam. All rights reserved.
//
// DESCRIPTION OF FILE



/* Create Footer START */
    function createFooter() 
    {
        var footer = document.getElementById("footer");
        setAttributes(footer,{"class": "footer"});

        var copyRightText = document.createElement("h1");
        setAttributes(copyRightText, {"class": "h1"}, "Copyright \u00A9 " + new Date().getFullYear() + " LogicPark Inc. All rights reserved.");
        /* THEME SELECTOR START*/
        /* Release when other features are finished
        var themeSwitch = document.createElement("button");
        setAttributes(themeSwitch, {"class":"theme-switch", "id":"themeSwitchButton"}, "theme");
        themeSwitch.onclick = function() {
            changeTheme();
        }
        footer.appendChild(themeSwitch);
        */
        /* THEME SELECTOR END */
        footer.appendChild(copyRightText);
        document.body.appendChild(footer);
    }
/* Create Footer END */


/* Create Menu START */
    function createMenu()
    {
          
    }
/* Create Menu END */

    window.onload = function() 
    {
     
    }
    
    
//Set multipule DOM attributes at once
    function setAttributes(el, attrs, text) 
    {
        for(var key in attrs) 
        {
            el.setAttribute(key, attrs[key]);
        }
        
        if (text) {
            el.innerHTML = text;
        }
    }







