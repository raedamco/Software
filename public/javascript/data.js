/* eslint-disable */

// turn into class structure long term so you can just call methods(functions) on these setting long term
///////////////////////////////////////////////////////////////////////////////////////////////////////////
class average_chart
{
    constructor()
    {
        this.occupancyData = []; // amount occupied array
        this.data_amount = 5; // the latest x amount of points
        this.occupancyTime =[]; // time stamp
        this.occupanceReadTime = []; // human readable timestamp
        this.graph_type = "area"; // line, area, or scatter
        this.organization = "PSUData"; // "PSU";// specific data set for grabbing
        this.parking_structure ="Parking Structure 1"; //"Revenue";// structure for data set
        this.floor = "Floor 2"; //"money"; // floor for data set
        this.temp = null;
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
   async getData(test) {
   var i =0;
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            database.collection(test.organization).doc(test.parking_structure).collection(test.floor).orderBy("Time","desc").limit(test.data_amount).get().then(async function(querySnapshot) {
                querySnapshot.forEach(async function(doc)
                {
                   console.log(doc.data()["Average"]);
                    test.occupancyData.push(doc.data()["Average"]);
                   var temp2 =  doc.data()["Time"].toDate();
                   // Testing output below
                   /*
                   console.log(temp2.getTime());
                   console.log(temp2);
                   console.log(occupancyTime[i]);
                   */
                   test.occupanceReadTime.push(temp2);
                  test.occupancyTime.push(temp2.getTime());
                  if(i >= (test.data_amount-1))
                  {
                    await test.temp.render();
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
    generateAverageOccupancuData(test);
}

}
 async function generateAverageOccupancuData(averageChart){
  var options = {
      chart: {
          height: 600,
          type: averageChart.graph_type,
      },
      dataLabels: {
          enabled: false
      },
      stroke: {
          curve: 'smooth',
      },
      series: [{
          name: 'Occupied',
          data: await averageChart.occupancyData,
      }],
      xaxis: {
          type: 'datetime',
          categories: averageChart.occupancyTime,
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
    var chart = new ApexCharts(document.querySelector("#average_chart"),await options);// make sure to change this line for different charts/div classes
    averageChart.temp = chart;
    //chart.render();


}
async function average_graph()
{
    var averageChart = new average_chart;
    console.log("TEST Average chart:" + average_chart.organization);
    await averageChart.getData(averageChart);
}