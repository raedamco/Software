//
//  floorClass.js
//  Raedam 
// TODO finish comments
//  Created on 5/13/2020. Modified on 6/30/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds floor class data/functions

///////////////////////////////////////////////////////////////////////////////////////////////////////////
var Floors = new Map(); // Map of floor objects 

class floor // floor object class
{
    constructor(structure, id, capacity, available)
    {
		this.id = id;
		this.capacity = capacity;
        this.available = available; 
        this.structure = structure;
	}
    
    createRow() // creates HTML row for floor
    {
        var table = document.getElementById("floorTable");
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.id = this.id;
        var rowText = document.createTextNode(this.id);
        var structure = this.structure;
         console.log("7/10/2020 " +td.id)
        td.appendChild(rowText);
        tr.appendChild(td);
        table.appendChild(tr);
        
        onRowClick("floorTable", function(row)
        {
            State = "Spot";
            var rowid = row.getElementsByTagName("td")[0].id;
            var title = document.getElementById("title");
            
            setAttributes(title,{"id": "title"}, structure + " - " + rowid);
            removeNode("floorTable");
            createMap(structure, rowid);
        });
    }
    
	update(available)// updates availibility
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
            document.getElementById(this.id).innerHTML = this.id + "<br>" + " Spots Free: " + this.available + "/" + this.capacity;
	}    
}

function createMap(StructureID, FloorID)// creates map of spots for specfic floor  
{
    var map = document.createElement("div");
    setAttributes(map, {"class": "map", "id": "map"});
    document.getElementById("main").appendChild(map);
    getSpots(StructureID, FloorID);
}