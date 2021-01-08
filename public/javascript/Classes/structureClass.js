//
//  structureClass.js
//  Raedam 
//
//  Created on 5/13/2020. Modified on 6/30/2020 by Austin Mckee.
//  Copyright © 2020 Raedam . All rights reserved.
//
// This file holds code for Structure objects

///////////////////////////////////////////////////////////////////////////////////////////////////////////
var Structures = new Map(); // Map of structure objects

class structure
{
	constructor(id, capacity, available, floors, location)
    {
		this.id = id;
		this.capacity = capacity;
        this.available = available;
		this.location = location;   
		this.floors = floors;
        //createRow();
	}
    
    createRow() // creates html row
    {
        var table = document.getElementById("structureTable");
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.id = this.id;
     
        var rowText = document.createTextNode(this.id);
        console.log("7/10/2020 " +td.id)
        td.appendChild(rowText);
        tr.appendChild(td);
        table.appendChild(tr);

        onRowClick("structureTable", function(row)
        {
            State = "Floor";
            var rowid = row.getElementsByTagName("td")[0].id;
            var title = document.getElementById("structureTitle");
            setAttributes(title,{"id": "title"}, rowid);
            removeNode("structureTable"); 
            createTable("floorTable");    
            getFloors(rowid);
            
        });
    }
    
    update(available) // updates data in row
    {
		this.available = available;
        var ratio = (this.available/this.capacity);
        
		if (ratio < 0.25)
        {
           document.getElementById(this.id).style.color = "red";
		}else if (ratio <= 0.50)
        {
			document.getElementById(this.id).style.color = "#ebdb34";
		}else
        {
			document.getElementById(this.id).style.color = "green";
		}
        document.getElementById(this.id).innerHTML = this.id + "<br> Spots Free: " + this.available + "/" + this.capacity;
	}
}