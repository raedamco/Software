//
//  revenue.js
//  Raedam 
//
//  Created on 5/13/2020. Modified on 6/30/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for the Revenue Occupancy Graph

///////////////////////////////////////////////////////////////////////////////////////////////////////////

class revenue_graph // for revenue vs time graph
{
    constructor()
    {
         this.data_amount = 5; // the latest x amount of points  
        /// long term look into dynamically changing ^^^ based off zoom/graph scope : week/month/3 months/etc 
        
        /****************************************************************/
        this.moneyData = []; // amount of revenue array
        this.moneyTime =[]; // time stamp
        this.moneyReadTime = []; // human readable timestamp
        /// long term have above values ^^^  update(on live update/ added value) instead of replacing objects 
        
        this.graph_type = "area"; // line, area, or scatter
        /*********************************************************/
        this.organization = "Portland State University"; // specific data set for grabbing
        this.data_level ="Revenue"; // first level after oragnization (takes place of park-structure)
        this.data_level2 = "money"; // second level in database to grab from takes place of floor
        /// should modify above code to have values as inputs so it can be used for any organization
        this.temp = null;
           
    }
    
   async getRev(test) // function called to get data from database
   {
        var i = 0;
        firebase.auth().onAuthStateChanged(function(user) 
        {
            if(user) 
            {
                database.collection("Companies").doc(test.organization).collection("Data").doc(test.data_level).collection(test.data_level2).orderBy("Time","desc").limit(test.data_amount).get().then(async function(querySnapshot) 
                {
                    querySnapshot.forEach(async function(doc)
                    {
                        console.log(doc.data()["amount"]);
                        test.moneyData.push(doc.data()["amount"]);
                        var temp2 =  doc.data()["time"].toDate();
                        test.moneyReadTime.push(temp2);
                        test.moneyTime.push(temp2.getTime());
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
            }
            else
            {
                signOut();
            }
        });
        generatemoneyData(test);
   }


}

// creates chart
async function generatemoneyData(myChart)
{
    var options = 
    {
      chart: 
      {
          height: 400,
          type: myChart.graph_type,
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
          name: 'Revenue',
          data:  await myChart.moneyData,
         
      }],
      xaxis: 
      {
          type: 'datetime',
          categories: myChart.moneyTime,
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
          text: "Revenue Overtime",
          style: 
          {
              color: "black"
          }
      },
    }
    var chart = new ApexCharts(document.querySelector("#money_chart"),await options); // make sure to change this line for different charts/div classes
    myChart.temp = chart;                  
}

// base function called by webpage that creates class object
async function test_graph()
{
    var myChart = new revenue_graph;
    console.log("TEST MYCHART:" + myChart.organization);
    await myChart.getRev(myChart);
}