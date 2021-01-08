//
//  spotClass.js
//  Raedam
//
//  Created on 5/13/2020. Modified on 7/10/2020.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for Spot Objects

///////////////////////////////////////////////////////////////////////////////////////////////////////////



var Spots = new Map(); // map of spot objects
var logs =  new Map(); // map of logs for spots object (Rowid, description)
////////////////////////////////////
function test_resize()// call function to resize all spot objects on page
{
    Spots.forEach(spot_resize)
     Ghosts.forEach(spot_resize)
}
function spot_resize(value) 
{
    value.on_resize();
}
//////////////////////////////////////////////
class spot 
{   constuctor()
    {
        console.log("test");
    }
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
       // console.log("7/10/2020 spot id"+ this.ID)
	}
      
    createSpots() // creates html spots
    {
       
        this.htmlSpot = document.createElement("div");
        var htmlSpot = this.htmlSpot;
        setAttributes(htmlSpot, {"class": "parking-spot", "id": this.ID}, this.ID);
        htmlSpot.innerHTML = this.ID;
        htmlSpot.style.top = this.Y;
        htmlSpot.style.left = (this.X)*(this.x_ratio * document.getElementById('map').clientWidth)+(this.x_ratio * document.getElementById('map').clientWidth) + "px";
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
         this.htmlSpot.style.left = (this.X)*(this.x_ratio * document.getElementById('map').clientWidth)+(this.x_ratio * document.getElementById('map').clientWidth) + "px";//(this.X)*(this.x_ratio * document.getElementById('map').clientWidth) + "px";
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
class ghost_spot extends spot {
    
    constructor(id,x, y, rotation)
    {
        super();
        this.ID = id;
        this.Rotation = rotation;
      
        this.x_ratio = 1/20; // ratio based on map size will need to map out floors manually 
        this.y_ratio = 1/25;  // will need to be passed in long term. Ratios control height/width 
        this.X = id; // used for placing on map
        this.Y = 0;  // same as above
        /// need to add min page sizes and address coming from database long term along with mapping y-axis
       // console.log("7/10/2020 spot id"+ this.ID)
	}
   createSpots()
  {
       super.createSpots();
      this.htmlSpot.innerHTML = "";
  }
    update()
    {
        this.element.style.backgroundColor = "grey";
    }
}
// this function update 7/10/2020 for spot type updates
async function createpopupview(spotID, OccupantID) // creates spot pop up
{
      var the_spot = Spots.get(spotID);
     // console.log("test: " + the_spot.Occupied);
      if(the_spot.Type.EV)
          {
                var ev = '<input type= "checkbox" id="EV" name="EV" value="true" checked>'+
            '<label for="EV"> EV</label><br>'
          }
      else{
            var ev = '<input type= "checkbox" id="EV" name="EV" value="false" >'+
            '<label for="EV"> EV</label><br>'
      }
    if(the_spot.Type.Hourly)
        {
            var hourly = '<input type= "checkbox" id="hourly" name="hourly" value="true" checked >'+
            '<label for="hourly"> Hourly</label><br>'
        }
        else
        {
             var hourly = '<input type= "checkbox" id="hourly" name="hourly" value="false" >'+
            '<label for="hourly"> Hourly</label><br>'    
        }
      if(the_spot.Type.Permit)
        {
            var permit = '<input type= "checkbox" id="permit" name="permit" value="true" checked>'+
            '<label for="permit"> Permit</label><br>'
        }
        else
        {
             var permit = '<input type= "checkbox" id="permit" name="permit" value="false" >'+
            '<label for="permit"> Permit</label><br>'
        }
        if(the_spot.Type.ADA)
        {
            var ADA = '<input type= "checkbox" id="ADA" name="ADA" value="true" checked>'+
            '<label for="ADA"> ADA</label><br>'
        }
        else
        {
             var ADA = '<input type= "checkbox" id="ADA" name="ADA" value="false" >'+
            '<label for="ADA"> ADA</label><br>'
        }
    if(the_spot.Type.Leased)
        {
            var Leased = '<input type= "checkbox" id="Leased" name="Leased" value="true" checked>'+
            '<label for="Leased"> Leased</label><br>'
        }
        else
        {
             var Leased = '<input type= "checkbox" id="Leased" name="Leased" value="false" >'+
            '<label for="Leased"> Leased</label><br>'
        }
    
   const{value: typeValues} = await Swal.fire({
      
        title: 'Settings for spot ' + spotID,
        
        html:
            '<h4> Spot Type(s): </h4>'+
            hourly +
            permit+
            ADA+
            ev+
            Leased,
        footer: '<button onclick="showSensorLog(' + spotID +')">Sensor Log</button>',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('ADA').checked,
                document.getElementById('permit').checked,
                document.getElementById('hourly').checked,
                document.getElementById('EV').checked,
                 document.getElementById('Leased').checked
            ]
        }
        /*
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value === "Permit" || value === "Hourly") 
                {
                    updateSpotData("Parking Structure 1", "Floor 2", spotID, value);
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
        */
    })
   if(typeValues)
   {
           updateSpotData(spotID,typeValues);
           Swal.fire({
                      title: "Success",
                      text: "Spot " + spotID + " type has been updated",
                      icon: "success",
                      confirmButtonText: "Close"
                    })
   }
}

function showSensorLog(SpotID)
{
    var w = window.open("log.html#" + SpotID);
}

// spot log class
class log{
    /// should make seperate file for logs
    constructor(time_start,time_end,occupied,htmlDoc,log_text,id)
        {
            // in html rowText - start rowText2 = end row text3 = occupancy
            this.time_start= time_start;
            this.time_end = time_end;
            this.occupied = occupied;
            this.htmlDoc = htmlDoc;
            this.log_text = log_text; // var text_info = [br,br2,rowText,rowText2,rowText3];
            this.id = id;
        }
        
        is_after(new_time) // checks time order
        {
            if(new_time > this.time_end)
                {
                    return true;
                }
            else
            {
                return false;
            }
        }
        update(time_end) // helps update log on new value
        {
            this.htmlDoc.removeChild(this.log_text[2]);
            this.htmlDoc.removeChild(this.log_text[4]);
            this.htmlDoc.removeChild(this.log_text[1]);
            this.time_end = time_end;
            this.time_end_text = document.createTextNode("End: "+ time_end);
            this.log_text[2] = this.time_end_text;
            this.htmlDoc.appendChild(this.time_end_text);
            this.htmlDoc.appendChild(this.log_text[1]);
            this.htmlDoc.appendChild(this.log_text[4]);
        }
    
}
        
        var current_log; 
function dataLogRows(tableID, description, time_start,time_end, occupied, id,SpotID) // creates log rows
{
    var table = document.getElementById(tableID);
     var tr = document.createElement('tr');
    var td = document.createElement('td');
     td.id = id;
    var br = document.createElement("BR");
    var br2 = document.createElement("BR");
    if(occupied == true)
        {
            var rowText2 = document.createTextNode("Start: "+time_start);
            var rowText = document.createTextNode("End: "+ time_end);
            var rowText3 = document.createTextNode("Occuppied");
        }else
        {
              var rowText2 = document.createTextNode("Start: "+time_start);
            var rowText = document.createTextNode("End: "+ time_end);
            var rowText3 = document.createTextNode("Unoccuppied");   
        }
    
    var text_info = [br,br2,rowText,rowText2,rowText3];
    if (occupied == false)
    {
        td.style.color = "green";
    }else
    {
       td.style.color = "red";
    }
    if(current_log == null)
    {
        current_log = new log(time_start,time_end,occupied,td,text_info,id);
    }
    else if(current_log.time_end < time_end)
        {
            current_log = new log(time_start,time_end,occupied,td,text_info,id);
        }
    
      if(current_log!= null)
    {
        if(current_log.time_end > time_start)
        {
           
            td.appendChild(rowText);
            td.appendChild(br);
            td.appendChild(rowText2);
            td.appendChild(br2);
            td.appendChild(rowText3);
            tr.appendChild(td);
            table.appendChild(tr);
        }
        else
        {
            console.log("in datalog rows for " + time_start)
            td.appendChild(rowText);
            td.appendChild(br);
            td.appendChild(rowText2);
            td.appendChild(br2);
            td.appendChild(rowText3);
            tr.appendChild(td);
            //table.appendChild(tr);
           table.insertBefore(tr,table.childNodes[0]);
        
        }    
    }
    else
    {
        td.appendChild(rowText);
        td.appendChild(br);
        td.appendChild(rowText2);
        td.appendChild(br2);
        td.appendChild(rowText3);
        tr.appendChild(td);
        table.appendChild(tr);
    } 
    td.appendChild(rowText);
    td.appendChild(br);
     td.appendChild(rowText2);
        td.appendChild(br2);
     td.appendChild(rowText3);
    tr.appendChild(td);
    //table.appendChild(tr);
    
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

function loadData() // initializes logs 
{
    var currentURL = (document.URL); // returns http://myplace.com/abcd
    var SpotID = currentURL.split("#")[1];
   
    console.log(SpotID);
    window.onload = function() 
    {
        document.getElementById("title").innerHTML = "Data log for spot " + SpotID;
        createTable("logsTable");
    }

   database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").collection("Floor 2").doc(SpotID).collection("Data").orderBy("Time.End", "desc").get().then(function(querySnapshot) 
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
                dataLogRows("logsTable", "", "No current data for " + SpotID, "", ID,SpotID);
            }else
            {
                dataLogRows("logsTable", description, time_start,time_end, occupied, ID,SpotID);
            }

        });
    });
    
    // below checks for the most recent log being modified if it is it call an update function 
    database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").collection("Floor 2").doc(SpotID).collection("Data").onSnapshot(function(snapshot)
    {   
        snapshot.docChanges().forEach(function(change)
        {
            if(change.type === "modified") // new log added
            {
                 console.log(change.doc.data().Time.Begin.toDate().toLocaleString());
                 current_log.update(change.doc.data().Time.End.toDate().toLocaleString());
                // dataLogRows("logsTable", change.doc.data().Occupant, change.doc.data().Time.Begin,change.doc.data().Time.End, change.doc.data().occupied, change.doc.data().id, SpotID);
            }
            if(change.type === "added")
                {
                   if(current_log != null)
                   {
                        if(current_log.is_after(change.doc.data().Time.Begin.toDate().toLocaleString()))
                        {
                            console.log("in the change added for" + change.doc.data().Time.Begin.toDate().toLocaleString())
                            time_start = change.doc.data().Time.Begin.toDate().toLocaleString();
                            time_end = change.doc.data().Time.End.toDate().toLocaleString();
                            console.log("pre datalogrow call value: " + change.doc.data().Occupied);
                            dataLogRows("logsTable", change.doc.data().Occupant, time_start,time_end,change.doc.data().Occupied, change.doc.data().id, SpotID);
                        }
                   }
                }
        });
    
    });
}
// here for update checks
// value[] 0 = ADA 1= permit 2 =hourly 3= EV
function updateSpotData(SpotID, Value)
{
  
    // Send updated settings then dimiss popup or alert enforcmenet about issue
    var ADA = Value[0];
    var Permit = Value[1];
    var Hourly = Value[2];
    var EV = Value[3];
    var Leased = Value[4];
    // updates map with new values
    var the_spot = Spots.get(SpotID);
    the_spot.Type.ADA = ADA;
    the_spot.Type.Permit = Permit;
     the_spot.Type.Hourly = Hourly;
     the_spot.Type.EV = EV;
     the_spot.Type.Leased = Leased;
    
    /// change it so PSU, structure, and floor are passed in 
   database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").collection("Floor 2").doc(SpotID).update({
        "Spot Type.Permit": Permit,
        "Spot Type.Hourly": Hourly,
        "Spot Type.EV": EV,
        "Spot Type.ADA": ADA,
        "Spot Type.Leased": Leased
    })
}
