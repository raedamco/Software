//
//  data.js
//  Theory Parking
//
//  Created on 5/13/2020. Modified on 5/13/2020.
//  Copyright © 2020 Theory Parking. All rights reserved.
//
// This file holds code for the Average Occupancy Graph

///////////////////////////////////////////////////////////////////////////////////////////////////////////
class average_chart // average occupancy graph for floor
{
    constructor()
    {
        this.occupancyData = []; // amount occupied array
        this.data_amount = 5; // the latest x amount of points
        this.occupancyTime =[]; // time stamp
        this.occupanceReadTime = []; // human readable timestamp
        this.graph_type = "area"; // line, area, or scatter
        /*********************************************************/
        this.organization = "PSUData"; // specific data set for grabbing
        this.parking_structure ="Parking Structure 1"; // structure for data set
        this.floor = "Floor 2";  // floor for data set
        /* should modify above code to make above lines customizable*/
        this.temp = null;
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
   async getData(test) 
   {
       // test.temp = chart 
        var i =0;
        firebase.auth().onAuthStateChanged(function(user) 
        {
            if(user) 
            {
                database.collection(test.organization).doc(test.parking_structure).collection(test.floor).orderBy("Time","desc").limit(test.data_amount).get().then(async function(querySnapshot) 
                {
                    querySnapshot.forEach(async function(doc)
                    {
                        console.log(doc.data()["Average"]);
                        test.occupancyData.push(doc.data()["Average"]);
                        var temp2 =  doc.data()["Time"].toDate();
                        test.occupanceReadTime.push(temp2);
                        test.occupancyTime.push(temp2.getTime());
                        if(i >= (test.data_amount-1))
                        {
                            await test.temp.render();
                        }
                        i++;

                    });
                }).catch(function(error) 
                {
                    alert("Error getting documents: " + error);
                });
            }else
            {
                signOut();
            }
        });
       
        generateAverageOccupancuData(test);
   }
   database.collection(this.test.organization).doc(this.test.parking_structure).collection(this.test.floor).onSnapshot(function(snapshot)
    {   
        snapshot.docChanges().forEach(function(change)
        {
            if(change.type === "added")
                {
                   
                    this.test.temp.destroy();
                    this.getData(this.test);
                }
        });
    
    });
}
 async function generateAverageOccupancuData(averageChart)
{
    var options = 
    {
        chart: 
        {
          height: 600,
          type: averageChart.graph_type,
        },
        dataLabels: 
        {
          enabled: false
        },
        stroke: 
        {
          curve: 'smooth',
        },
        series: 
        [{
          name: 'Occupied',
          data: await averageChart.occupancyData,
        }],
        xaxis: 
        {
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
      tooltip: 
      {
          x: 
          {
              format: 'dd/MM/yy HH:mm'
          }
      },
      title: 
      {
          text: "Average Occupancy - Structure 1, Floor 2",
          style: 
          {
              color: "black"
          }
      },
    }
    var chart = new ApexCharts(document.querySelector("#average_chart"),await options);// make sure to change this line for different charts/div classes
    averageChart.temp = chart;
}
async function average_graph()
{
    var averageChart = new average_chart;
    console.log("TEST Average chart:" + average_chart.organization);
    await averageChart.getData(averageChart);
}