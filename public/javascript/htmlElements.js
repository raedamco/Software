/* eslint-disable */




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

/* Theme Selection START */
/*
function changeTheme() {
    const toggleSwitch = document.getElementById('themeSwitchButton');
    const currentTheme = localStorage.getItem('theme');
    var darkMode = Boolean();
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (darkMode === 'dark') {
            darkMode = true;
        } else {
            darkMode = false;
        }
    }

    function switchTheme(onclick) {
        if (darkMode === true) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            darkMode = false;
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }    
    }

    //toggleSwitch.addEventListener('click', switchTheme, false);
}
*/ 
/* Theme Selection END */









