//
//  spotClass.js
//  Theory Parking
//
//  Created on 5/13/2020. Modified on 5/13/2020.
//  Copyright © 2020 Theory Parking. All rights reserved.
//
// This file holds code for Spot Objects

///////////////////////////////////////////////////////////////////////////////////////////////////////////

var Spots = new Map(); // map of spot objects
var logs =  new Map(); // map of logs for spots object (Rowid, description)
////////////////////////////////////
function test_resize()// call function to resize all spot objects on page
{
    Spots.forEach(spot_resize)
}
function spot_resize(value) 
{
    value.on_resize();
}
//////////////////////////////////////////////
class spot 
{
    constructor(id, occupied, occupant, x, y, rotation, type)
    {
        this.ID = id;
        this.Occupied = occupied;
        this.Rotation = rotation;
        this.Occupant = occupant;
        this.Type = type;
        this.x_ratio = 1/20; // ratio based on map size will need to map out floors manually 
        this.y_ratio = 1/25;  // will need to be passed in long term. Ratios control height/width 
        this.X = id; // used for placing on map
        this.Y = 0;  // same as above
        /// need to add min page sizes and address coming from database long term along with mapping y-axis
	}
      
    createSpots()
    {
        this.htmlSpot = document.createElement("div");
        var htmlSpot = this.htmlSpot;
        setAttributes(htmlSpot, {"class": "parking-spot", "id": this.ID}, this.ID);
        htmlSpot.innerHTML = this.ID;
        htmlSpot.style.top = this.Y;
        htmlSpot.style.left = (this.X-1)*(this.x_ratio * document.getElementById('map').clientWidth) + "px";
        htmlSpot.style.width = "4.8%";
        htmlSpot.style.height = "18%";
        this.element = document.getElementById("map").appendChild(htmlSpot);
        htmlSpot.style.transform = 'rotate('+this.Rotation+'deg)';
        
        htmlSpot.onclick= function() 
        {
            createpopupview(this.id, this.occupant);
        }
    }
    //////////////////////////////////////////
    on_resize()
    {
         this.htmlSpot.style.top = this.Y;
         this.htmlSpot.style.left = (this.X-1)*(this.x_ratio * document.getElementById('map').clientWidth) + "px";
    }
////////////////////////////////////////////
	update(occupied)// updates spot occupancy
    {
		if(occupied == true){
			this.element.style.backgroundColor = "red";
		}else if(occupied == false){
			this.element.style.backgroundColor = "green";
		}
	}

}

function createpopupview(spotID, OccupantID)
{
    Swal.fire({
        title: 'Settings for spot ' + spotID,
        input: 'select',
        footer: '<button onclick="showSensorLog(' + spotID +')">Sensor Log</button>',
        inputOptions: {
            Permit: 'Permit',
            Hourly: 'Hourly',
        },
        inputPlaceholder: 'Spot Type',
        showCancelButton: true,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value === "Permit" || value === "Hourly") 
                {
                    updateSpotData("Parking Structure 1", "Floor 1", spotID, value);
                    Swal.fire({
                      title: "Success",
                      text: "Spot " + spotID + " has been updated to " + value,
                      icon: "success",
                      confirmButtonText: "Close"
                    })
                }else
                {
                    resolve('Please update a setting to continue')
                }
            })
        }
    })
}

function showSensorLog(SpotID)
{
    var w = window.open("log.html#" + SpotID);
}

function dataLogRows(tableID, description, time_start,time_end, occupied, id) 
{
    var table = document.getElementById(tableID);
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.id = id;
    var br = document.createElement("BR");
    var br2 = document.createElement("BR");
    if(occupied == true)
        {
            var rowText = document.createTextNode("Start: "+time_start);
            var rowText2 = document.createTextNode("END: "+ time_end);
            var rowText3 = document.createTextNode("Occuppied");
        }else
        {
              var rowText = document.createTextNode("Start: "+time_start);
            var rowText2 = document.createTextNode("END: "+ time_end);
            var rowText3 = document.createTextNode("Unoccuppied");   
        }
    

    if (occupied == false)
    {
        td.style.color = "green";
    }else
    {
       td.style.color = "red";
    }

    td.appendChild(rowText);
    td.appendChild(br);
     td.appendChild(rowText2);
        td.appendChild(br2);
     td.appendChild(rowText3);
    tr.appendChild(td);
    table.appendChild(tr);
    
    var rowid = tr.getElementsByTagName("td")[0].id;
    logs.set(rowid, description);
    
    onRowClick(tableID, async function(row)
    {
        var rowid = row.getElementsByTagName("td")[0].id;
        
        //await console.log("DATA ID", loggedData.I); 

        Swal.fire({
            title: "Info",
            html: logs.get(rowid),
            icon: "info",
            confirmButtonText: "Close"
        })
    });
}

var loggedData = {
    distance: [],
    time: [],
    ID: [],
    occupied: [],
    occupant: [],
    description: [],
}

function loadData() 
{
    var currentURL = (document.URL); // returns http://myplace.com/abcd
    var SpotID = currentURL.split("#")[1];
    console.log("WAS HERE 6/1/2020");
    console.log(SpotID);
    window.onload = function() 
    {
        document.getElementById("title").innerHTML = "Data log for spot " + SpotID;
        createTable("logsTable");
    }

    database.collection("PSU").doc("Parking Structure 1").collection("Floor 2").doc(SpotID).collection("Data").orderBy("Time.End", "desc").get().then(function(querySnapshot) 
    {
        querySnapshot.forEach(function(doc) 
        {
            let ID = doc.id;
            let time_start = doc.data().Time.Begin.toDate().toLocaleString() ;
            let time_end = doc.data().Time.End.toDate().toLocaleString();//.toDate();
            //time.toDate();
         
            let occupied = doc.data().Occupied;
            var occupant;

            loggedData.ID.push(ID);
            //loggedData.time.push(time);
          
            loggedData.occupied.push(occupied);
            
            if (occupied == false)
            {
               // loggedData.occupant.push("Occupant: None");
                 occupant = "Occupant: None";
            }else
            {
                //loggedData.occupant.push("Occupant: " + occupant);
                occupant = "Occupant: Coming Soon!";
            }
            

           let description =   occupant;
            //loggedData.description.push(description);
            
            if (loggedData.length <= 0) 
            {
                dataLogRows("logsTable", "", "No current data for " + SpotID, "", ID);
            }else
            {
                dataLogRows("logsTable", description, time_start,time_end, occupied, ID);
            }

        });
    });
}


function updateSpotData(StructureID, FloorID, SpotID, Value)
{
    // Send updated settings then dimiss popup or alert enforcmenet about issue
    let Permit,
        Hourly

    if (Value == "Permit")
    {
        Permit = true;
        Hourly = false;
    }else if (Value == "Hourly")
    {
        Hourly = true
        Permit = false;
    }

    database.collection("PSU").doc("Parking Structure 1").collection("Floor 2").doc("1").update({
        "Spot Type.Permit": Permit,
        "Spot Type.Hourly": Hourly,
    })
}
