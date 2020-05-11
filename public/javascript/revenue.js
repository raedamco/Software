/* eslint-disable */

// turn into class structure long term so you can just call methods(functions) on these setting long term
//  !!!!!!!!!!!!!!!! 
// Need to use classes so revenue and data can be used at the same time on same page
// !!!!!!!!!!!!!!!!!!!!!
///////////////////////////////////////////////////////////////////////////////////////////////////////////

class revenue_graph
{
    constructor()
    {
        this.moneyData = []; // amount occupied array
        this.data_amount = 5; // the latest x amount of points
        this.moneyTime =[]; // time stamp
        this.moneyReadTime = []; // human readable timestamp
        this.graph_type = "area"; // line, area, or scatter
        this.organization = "PSU"; // specific data set for grabbing
        this.data_level ="Revenue"; // first level after oragnization (takes place of park-structure)
        this.data_level2 = "money"; // second level in database to grab from takes place of floor
        
            console.log("ORG:"+ this.organization);
            console.log("data_level: " + this.data_level);
            console.log("data_level2: " + this.data_level2);
    }
    
   getRev() 
    {
        var i =0;
        console.log("made it in getData in rev");
        console.log("ORG:"+ this.organization);
            console.log("data_level: " + this.data_level);
            console.log("data_level2: " + this.data_level2);
        firebase.auth().onAuthStateChanged(function(user) {
    // var scope issue with vars after this ^^^^^^ 
        if(user) {
            console.log("made it in user if");
            
         database.collection(this.organization).doc(this.data_level).collection(this.data_level2).orderBy("Time","desc").limit(this.data_amount).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc)
                {
                   console.log(doc.data()["amount"]);
                    this.moneyData.push(doc.data()["amount"]);
                   var temp2 =  doc.data()["time"].toDate();
                   // Testing output below
                
                   console.log(temp2.getTime());
                   console.log(temp2);
                   console.log(occupancyTime[i]);
                
                   this.moneyReadTime.push(temp2);
                  this.moneyTime.push(temp2.getTime());
                  if(i >= (this.data_amount-1))
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
    generatemoneyData(self);
}


}

// async function 
async function generatemoneyData(myChart){
     var temp;
console.log("made it in generatemoneyData");
  var options = {
      chart: {
          height: 400,
          type: myChart.graph_type,
      },
      dataLabels: {
          enabled: false
      },
      stroke: {
          curve: 'smooth',
      },
      series: [{
          name: 'Revenue',
          data:  await myChart.moneyData,
          //await
      }],
      xaxis: {
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
async function test_graph()
{
    var myChart = new revenue_graph;
    console.log("TEST MYCHART:" + myChart.organization)
    await myChart.getRev();
}