/*eslint-disable */
var State = "Structure"; //First page

// RETRIEVE DATA FROM DATABASE START //
function getData() {
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

function getStructures(CUID){
    createTable("structureTable");
    console.log("was here")
    database.collection("PSU").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var id = doc.id;
            var capacity = doc.data()["Capacity"]["Capacity"];
            var available = doc.data()["Capacity"]["Available"];
            var floors = doc.data()["Capacity"]["Floors"];
            var location = doc.data()["Capacity"]["Location"];
            
            var structureClass = new structure(id, capacity, available, floors, location);
		    structureClass.createRow();
            Structures.set(id, structureClass);
            Structures.get(id).update(available);
        });
    }).catch(function(error) {
        alert("Error getting documents: " + error);
    });
    
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

function getFloors(StructureID) { 
    var floorArray = [];

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


function getSpots(StructureID, FloorID) {
   
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
       // Spots.forEach(spot_resize())
    });
///////////////////////////////////////////
    }).catch(function(error) {
        alert("Error getting documents: " + error);
    });
    
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


