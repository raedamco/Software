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
       console.log("6/19/20 8:33");
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
       
                //console.log(test.organization + " - " + test.parking_structure + " - " + test.floor );
                      
   }
   
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
    console.log("TEST Average chart:" + await average_chart.organization);
    await averageChart.getData(averageChart);
    // check all of this 6/19/2020
    var unsubscribe = database.collection(averageChart.organization).doc(averageChart.parking_structure).collection(averageChart.floor).orderBy("Time","desc").limit(averageChart.data_amount).onSnapshot(async function(snapshot)
                {  
                  //  console.log("was here ")  
                    snapshot.docChanges().forEach(async function(change)
                    {   
                      //  console.log("was here 1")
                        if(change.type === "added")
                        {
                          //  console.log("was here 2")
                            averageChart.temp.destroy();
                            console.log("added log: " + change.doc.data()["Time"].toDate());
                            averageChart.occupancyTime[averageChart.data_amount-1] = change.doc.data()["Time"].toDate();
                            averageChart.occupancyData[averageChart.data_amount-1] = change.doc.data()["Average"];
                            generateAverageOccupancuData(averageChart);
                            await averageChart.temp.render();
                           // unsubscribe();
                            //average_graph();
                        }
                         /*if(change.type ===  "modified")
                        {
                            console.log("was here 3")
                            averageChart.temp.destroy();
                            average_graph();
                           
                        }
                        */
                    });
    
                });
}