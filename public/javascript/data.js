/* eslint-disable */

// turn into class structure long term so you can just call methods(functions) on these setting long term
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var occupancyData = []; // amount occupied array
var data_amount = 10; // the latest x amount of points
var occupancyTime =[]; // time stamp
var occupanceReadTime = []; // human readable timestamp
var graph_type = "area"; // line, area, or scatter
var organization = "PSUData"; // "PSU";// specific data set for grabbing
var parking_structure ="Parking Structure 1"; //"Revenue";// structure for data set
var floor = "Floor 2"; //"money"; // floor for data set
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
 function getData() {
   var i =0;
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            database.collection(organization).doc(parking_structure).collection(floor).orderBy("Time","desc").limit(data_amount).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc)
                {
                   console.log(doc.data()["Average"]);
                    occupancyData.push(doc.data()["Average"]);
                   var temp2 =  doc.data()["Time"].toDate();
                   // Testing output below
                   /*
                   console.log(temp2.getTime());
                   console.log(temp2);
                   console.log(occupancyTime[i]);
                   */
                   occupanceReadTime.push(temp2);
                  occupancyTime.push(temp2.getTime());
                  if(i >= (data_amount-1))
                  {
                    temp.render();
                  }
                    //location.reload();
                    //  console.log(doc.data()["Time"].toDate());
                    i++;

                });
            }).catch(function(error) {
                alert("Error getting documents: " + error);
            });
        }else{
            signOut();
        }
    });
    generateAverageOccupancuData(occupancyData);
}

var temp;
 async function generateAverageOccupancuData(occupancyData){
  var options = {
      chart: {
          height: 400,
          type: graph_type,
      },
      dataLabels: {
          enabled: false
      },
      stroke: {
          curve: 'smooth',
      },
      series: [{
          name: 'Occupied',
          data: await occupancyData,
      }],
      xaxis: {
          type: 'datetime',
          categories: occupancyTime,
      },
      /*
      yaxis: {
          labels: {
            style: {
              color: 'black'
            }
          }
      },*/
      tooltip: {
          x: {
              format: 'dd/MM/yy HH:mm'
          }
      },
      title: {
          text: "Average Occupancy - Structure 1, Floor 2",
          style: {
              color: "black"
          }
      },
  }
    var chart = new ApexCharts(document.querySelector("#chartprediction"),await options);
    temp = chart;
    //chart.render();


}
// Testing outputs below

//console.log("Occupancy data",occupancyData);
//console.log("occupancyTime", occupancyTime);
//console.log("occupancy read time",occupanceReadTime)
//console.log(options.series);
