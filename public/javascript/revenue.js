//
//  revenue.js
//  Theory Parking
//
//  Created on 5/13/2020. Modified on 5/13/2020.
//  Copyright © 2020 Theory Parking. All rights reserved.
//
// This file holds code for the Revenue Overtime Graph

///////////////////////////////////////////////////////////////////////////////////////////////////////////

class revenue_graph // for revenue vs time graph
{
    constructor()
    {
        this.moneyData = []; // amount of revenue array
        this.data_amount = 5; // the latest x amount of points
        this.moneyTime =[]; // time stamp
        this.moneyReadTime = []; // human readable timestamp
        this.graph_type = "area"; // line, area, or scatter
        /*********************************************************/
        this.organization = "PSU"; // specific data set for grabbing
        this.data_level ="Revenue"; // first level after oragnization (takes place of park-structure)
        this.data_level2 = "money"; // second level in database to grab from takes place of floor
        /* should modify above code to make above lines customizable*/
        this.temp = null;
           
    }
    
   async getRev(test) // function called to get data from database
   {
        var i = 0;
        firebase.auth().onAuthStateChanged(function(user) 
        {
            if(user) 
            {
                database.collection(test.organization).doc(test.data_level).collection(test.data_level2).orderBy("Time","desc").limit(test.data_amount).get().then(async function(querySnapshot) 
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

// async function  
// add function below into class above and modify vars to fit
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


async function test_graph()
{
    var myChart = new revenue_graph;
    console.log("TEST MYCHART:" + myChart.organization);
    await myChart.getRev(myChart);
}