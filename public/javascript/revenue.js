/* eslint-disable */

// turn into class structure long term so you can just call methods(functions) on these setting long term
//  !!!!!!!!!!!!!!!! 
// Need to use classes so revenue and data can be used at the same time on same page
// !!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var moneyData = []; // amount occupied array
var data_amount = 5; // the latest x amount of points
var moneyTime =[]; // time stamp
var moneyReadTime = []; // human readable timestamp
var graph_type = "area"; // line, area, or scatter
var organization = "PSU"; // specific data set for grabbing
var data_level ="Revenue"; // first level after oragnization (takes place of park-structure)
var data_level2 = "money"; // second level in database to grab from takes place of floor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log("I was in revenue 05/08/2020");
 function getRev() {
   var i =0;
     console.log("made it in getData in rev");
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            database.collection(organization).doc(data_level).collection(data_level2).orderBy("Time","desc").limit(data_amount).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc)
                {
                   console.log(doc.data()["amount"]);
                    moneyData.push(doc.data()["amount"]);
                   var temp2 =  doc.data()["time"].toDate();
                   // Testing output below
                   /*
                   console.log(temp2.getTime());
                   console.log(temp2);
                   console.log(occupancyTime[i]);
                   */
                   moneyReadTime.push(temp2);
                  moneyTime.push(temp2.getTime());
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
    generatemoneyData(moneyData);
}

var temp;
 async function generatemoneyData(moneyData){
console.log("made it in generatemoneyData");
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
          name: 'Revenue',
          data: await moneyData,
      }],
      xaxis: {
          type: 'datetime',
          categories: moneyTime,
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
          text: "Revenue Overtime",
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
