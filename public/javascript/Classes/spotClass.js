/* eslint-disable */

var Spots = new Map();
var logs =  new Map(); // Rowid, descriptioin
////////////////////////////////////
function test_resize()
{
   // console.log(Spots)
    Spots.forEach(spot_resize)
}
function spot_resize(value) {
    //console.log(`map.get('${key}') = ${value}`);
    //console.log(value)
    value.on_resize();
}
//////////////////////////////////////////////
class spot {
    constructor(id, occupied, occupant, x, y, rotation, type){
        this.ID = id;
        this.Occupied = occupied;
//        this.X = x;
//        this.Y = y;
   
        this.Rotation = rotation;
        this.Occupant = occupant;
        this.Type = type;
        this.x_ratio = 1/20; // ratio based on map size will need to map out floors manually 
        this.y_ratio = 1/25;  // will need to be passed in long term. Ratios control height/width 
        this.X = id; // used for placing on map
        this.Y = 0;  // same as above
        /// need to add min page sizes and address coming from database long term along with mapping y-axis
	}
      
    createSpots(){
        //var scalor = 6; // 5.2 works @ 1440 so window width 5.2/1440*window_width
        this.htmlSpot = document.createElement("div");
        var htmlSpot = this.htmlSpot;

        setAttributes(htmlSpot, {"class": "parking-spot", "id": this.ID}, this.ID);
        htmlSpot.innerHTML = this.ID;

         htmlSpot.style.top = this.Y;
        htmlSpot.style.left = (this.X-1)*(this.x_ratio * document.getElementById('map').clientWidth) + "px";
         htmlSpot.style.width = "4.8%";
         htmlSpot.style.height = "18%";
        console.log(this.X);
        

        this.element = document.getElementById("map").appendChild(htmlSpot);
        htmlSpot.style.transform = 'rotate('+this.Rotation+'deg)';

        htmlSpot.onclick= function() {
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
	update(occupied){
		if(occupied == true){
			this.element.style.backgroundColor = "red";
		}else if(occupied == false){
			this.element.style.backgroundColor = "green";
		}
	}

}

function createpopupview(spotID, OccupantID){
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
                if (value === "Permit" || value === "Hourly") {
                    updateSpotData("Parking Structure 1", "Floor 1", spotID, value);
                    Swal.fire({
                      title: "Success",
                      text: "Spot " + spotID + " has been updated to " + value,
                      icon: "success",
                      confirmButtonText: "Close"
                    })
                }else{
                    resolve('Please update a setting to continue')
                }
            })
        }
    })
}

function showSensorLog(SpotID){
    var w = window.open("log.html#" + SpotID);
}

function dataLogRows(tableID, description, time, occupied, id) {
    var table = document.getElementById(tableID);
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.id = id;
    
    var rowText = document.createTextNode(time);

    if (occupied == false){
        td.style.color = "green";
    }else{
       td.style.color = "red";
    }

    td.appendChild(rowText);
    tr.appendChild(td);
    table.appendChild(tr);
    
    var rowid = tr.getElementsByTagName("td")[0].id;
    logs.set(rowid, description);
    
    onRowClick(tableID, async function(row){
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

function loadData() {
    var currentURL = (document.URL); // returns http://myplace.com/abcd
    var SpotID = currentURL.split("#")[1];

    console.log(SpotID);
    window.onload = function() {
        document.getElementById("title").innerHTML = "Data log for spot " + SpotID;
        createTable("logsTable");
    }

    database.collection("PSU").doc("Parking Structure 1").collection("Floor 2").doc(SpotID).collection("Data").orderBy("Time", "desc").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let ID = doc.id;
            let time = doc.data().Time.toDate();
            let distance = doc.data()["Distance (in)"];
            let occupied = doc.data().Occupied;
            var occupant;

            loggedData.ID.push(ID);
            loggedData.time.push(time);
            loggedData.distance.push(distance);
            loggedData.occupied.push(occupied);
            
            if (occupied == false){
                loggedData.occupant.push("Occupant: None");
                occupant = "Occupant: None";
            }else{
                loggedData.occupant.push("Occupant: " + occupant);
                occupant = "Occupant: Coming Soon!";
            }
            

            let description = "Occupied: " + occupied + "<br>" + "Distance: " + (Math.round(distance*10))/10 + " in" + "<br>" + occupant;
            loggedData.description.push(description);
            
            if (loggedData.length <= 0) {
                dataLogRows("logsTable", "", "No current data for " + SpotID, "", ID);
            }else{
                dataLogRows("logsTable", description, time, occupied, ID);
            }

        });

//        for (var i = 0; i < loggedData.ID.length; ++i) {
//            dataLogRows("logsTable", "Occupied: " + loggedData.occupied[i] + "<br>" + loggedData.distance[i] + "<br>" + loggedData.occupant[i], loggedData.time[i], loggedData.occupied[i]);
//        }
    });
}


function updateSpotData(StructureID, FloorID, SpotID, Value){
    // Send updated settings then dimiss popup or alert enforcmenet about issue
    let Permit,
        Hourly

    if (Value == "Permit"){
        Permit = true;
        Hourly = false;
    }else if (Value == "Hourly"){
        Hourly = true
        Permit = false;
    }

    database.collection("PSU").doc("Parking Structure 1").collection("Floor 2").doc("1").update({
        "Spot Type.Permit": Permit,
        "Spot Type.Hourly": Hourly,
    })
}
