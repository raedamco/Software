/*eslint-disable */
//
//  retrieveData.js
//  Raedam 
//
//  Created on 5/13/2020. Modified on 6/30/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for the dashboard initialization. This file starts creating objects of the structure classes and is called by html file

///////////////////////////////////////////////////////////////////////////////////////////////////////////
var State = "Structure"; //First page

// RETRIEVE DATA FROM DATABASE START //
// essentially logs into database
async function getData() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            var title = document.getElementById("structureTitle");
            setAttributes(title,{"id": "structureTitle"}, "Portland State University");
            database.collection("Companies").where("Info.CUID", "==", "f6KIyH6vyFTTrQ6J6zjaRzlqXN32").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    var CompanyName = doc.data()["Info"].Name;
                    var CUID = doc.data()["Info"].CUID;
                    var Structures = doc.data()["Info"].Structures;
                    getStructures(CUID, Structures);
                });
            }).catch(function(error) {
                alert("Error getting documents: " + error);
            });
        }else{
            signOut();
        }
    });
}
 // starts grabbing structure from database and creates structure class objects. Also adds struture objects in map.
 async function getStructures(CUID){
    createTable("structureTable");
     /// longterm have organization("PSU") as input for scaling
    database.collection("PSU").get().then( async function(querySnapshot) {
        querySnapshot.forEach( async function(doc) {
            var id = doc.id;
            if (await doc.data()  != undefined){
            
                    var capacity = await doc.data()["Capacity"]["Capacity"];
                    console.log("capacity test: " + capacity);
                    var available = doc.data()["Capacity"]["Available"];
                    console.log("available test: " + available);
                    var floors = doc.data()["Capacity"]["Floors"];
                    var location = doc.data()["Capacity"]["Location"];
              
            var structureClass = new structure(id, capacity, available, floors, location);
		    structureClass.createRow();
            Structures.set(id, structureClass);
            Structures.get(id).update(available);
            
                }});
    }).catch(function(error) {
        alert("Error getting documents: " + error);
    });
     /// longterm have organization("PSU") as input for scaling
    database.collection("PSU").onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (State != "Structure"){
                var unsubscribe =  database.collection("PSU").onSnapshot(function () {
                    console.log("Unsubscribed to strucutre listener");
                });
                unsubscribe();
            }else if (change.type === "modified") {
                var id = change.doc.id;
                var available = change.doc.data()["Capacity"]["Available"];
                Structures.get(id).update(available);
            } 
        });
    });
}
// starts grabbing floor from database and creates floor class objects. Also adds floor objects in map.
function getFloors(StructureID) { 
    var floorArray = [];
     /// longterm have organization("PSU") as input for scaling
    database.collection("PSU").doc(StructureID).get().then(function(doc) {
        var id = doc.data()["Floors"];
        floorArray.push(id);
        
        for (var i = 0; i < floorArray; ++i) {
            var available = doc.data()["Floor Data"]["Floor " + (1+i)]["Available"];
            var capacity = doc.data()["Floor Data"]["Floor " + (1+i)]["Capacity"];
            
            var floorClass = new floor(StructureID, "Floor " + (1+i), capacity, available);
            floorClass.createRow();
            Floors.set("Floor " + (1+i), floorClass);
            Floors.get("Floor " + (1+i)).update(available);
        }

    }).catch(function(error) {
        alert("Error getting documents: " + error);
    });
     /// longterm have organization("PSU") as input for scaling
    database.collection("PSU").onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (State != "Floor"){
                var unsubscribe =  database.collection("PSU").onSnapshot(function () {
                    console.log("Unsubscribed to strucutre listener");
                });
                unsubscribe();
            }else if (change.type === "modified") {
                for (var i = 0; i < floorArray; ++i) {
                    var available = change.doc.data()["Floor Data"]["Floor " + (1+i)]["Available"];
                    var capacity = change.doc.data()["Floor Data"]["Floor " + (1+i)]["Capacity"];
                    Floors.get("Floor " + (1+i)).update(available);
                }
            }
        });
    });
}

// starts grabbing spotsfrom database and creates spot class objects. Also adds spot objects in map.
function getSpots(StructureID, FloorID) {
    /// longterm have organization("PSU") as input for scaling
    database.collection("PSU").doc(StructureID).collection(FloorID).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var id = doc.id;
        var occupied = doc.data()["Occupancy"]["Occupied"];
        var occupant = doc.data()["Occupancy"]["Occupant"];
        var x = doc.data()["Layout"]["x"];
        var y = doc.data()["Layout"]["y"];
        var rotation = doc.data()["Layout"]["rotation"];
        
        var spotClass = new spot(id, occupied, occupant, x, y, rotation);
		spotClass.createSpots();
        Spots.set(doc.id, spotClass);
        Spots.get(doc.id).update(occupied);
    });
        /////////////////////////////////
         window.addEventListener("resize", function()
    {
             test_resize();
    });
///////////////////////////////////////////
    }).catch(function(error) {
        alert("Error getting documents: " + error);
    });
    // listen for change below
     /// longterm have organization("PSU") as input for scaling
    database.collection("PSU").doc(StructureID).collection(FloorID).onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (State != "Spot"){
                var unsubscribe =  database.collection("PSU").onSnapshot(function () {
                    console.log("Unsubscribed to strucutre listener");
                });
                unsubscribe();
            }else if (change.type === "modified") {
                var id = change.doc.id;
                var occupied = change.doc.data()["Occupancy"]["Occupied"];
                Spots.get(id).update(occupied);
                console.log(State);
            }
        });
    });
}

// redirects to object in row's onRowClick function (if it's a structure the sturcuture's/ if it's a floor that floor's) 
function onRowClick(tableId, callback) {
    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        table.rows[i].onclick = function (row) {
            return function () {
                callback(row);
            };
        }
        (table.rows[i]);
    }
};

// creates HTML table
function createTable(tableID) {   
    var container = document.getElementById("container");
    var table = document.createElement('table');
    table.id = tableID;
    container.appendChild(table);
}

 
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


