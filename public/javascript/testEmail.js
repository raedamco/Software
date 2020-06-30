/// FOR OMAR PLEASE FILL IN HEADER AND COMMENT FILE SIMILAR TO HOW DATA.JS IS DONE
//
//  Account.js
//  Raedam 
//
//  Created on FILL IN. Modified on FILL IN by FILL IN.
//  Copyright © 2020 Raedam. All rights reserved.
//
// DESCRIPTION OF FILE
//Listen for form submit
document.getElementById('Contact_form').addEventListener('submit', submitForm);

function submitForm(e)
{
  e.preventDefault();
    formToDatabase();
}