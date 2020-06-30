//
//  data.js
//  Raedam 
//
//  Created on 5/13/2020. Modified on 6/30/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for the Average Occupancy Graph

///////////////////////////////////////////////////////////////////////////////////////////////////////////
class average_chart // average occupancy graph for floor
{
   constructor()
    {
        
        this.data_amount = 5; // the latest x amount of points  
        /// long term look into dynamically changing ^^^ based off zoom/graph scope : week/month/3 months/etc 
        
        /****************************************************************/
        this.occupancyData = []; // amount occupied array
        this.occupancyTime =[]; // time stamp
        this.occupanceReadTime = []; // human readable timestamp
        /// long term have above values ^^^  update(on live update/ added value) instead of replacing objects 
        
        this.graph_type = "area"; // line, area, or scatter
        
        /*********************************************************/
        this.organization = "PSUData"; // specific data set for grabbing
        this.parking_structure ="Parking Structure 1"; // structure for data set
        this.floor = "Floor 2";  // floor for data set
        /// should modify above code to have values as inputs so it can be used for any organization
        
        this.temp = null;
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // gets data from database for charts and stores in class
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
   
}
 // creates chart 
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
          categories: await averageChart.occupancyTime,
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

// base function called by webpage that creates class object and calls function and monitors for changes 
async function average_graph()
{
    /// this function should have parameters long term that makes it easy to call for any organization
    
    
    var averageChart = new average_chart;
    await averageChart.getData(averageChart);
    var unsubscribe = database.collection(averageChart.organization).doc(averageChart.parking_structure).collection(averageChart.floor).orderBy("Time","desc").limit(averageChart.data_amount).onSnapshot(async function(snapshot)
                {  
                    snapshot.docChanges().forEach(async function(change)
                    {   
                        if(change.type === "added")
                        {
                          averageChart.temp.destroy();
                          averageChart = new average_chart;
                          await averageChart.getData(averageChart);
                          ///   might try updating object instead of replacing object long term but this way works for now
                        }
                    });
                });
}