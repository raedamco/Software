//
//  data.js
//  Raedam 
//
//  Created on 5/13/2020. Modified on 1/30/2021 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for the Average Occupancy Graph

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * average occupancy graph for floor
 */
class average_chart 
{
   constructor()
    {
        // testting 24 as highest right now
        this.data_amount = 744; // the latest x amount of points  
        /// long term look into dynamically changing ^^^ based off zoom/graph scope : week/month/3 months/etc 
        
        // 12 hours / 24 hours/ 1 week/ 1 month for beta launch 
        // going to have to look into how to do a month
        // 12 hours will be default
        /****************************************************************/
        this.occupancyData = []; // amount occupied array
        this.occupancyTime =[]; // time stamp
        this.occupanceReadTime = []; // human readable timestamp
        /// long term have above values ^^^  update(on live update/ added value) instead of replacing objects 
        
        this.graph_type = "area"; // line, area, or scatter
        
        /*********************************************************/
        this.organization = "Portland State University"; // specific data set for grabbing
        this.parking_structure ="Parking Structure 1"; // structure for data set
        this.floor = "Floor 2";  // floor for data set
        /// should modify above code to have values as inputs so it can be used for any organization
        
        this.temp = null; // TODO rename
        
    }
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    /**
     * gets data from database for charts and stores in class
     * @param {object} graphValue instance of average_chart class
     */
   async getData(graphValue) 
   {
      
       
        var i =0;
        firebase.auth().onAuthStateChanged(function(user) 
        {
            if(user) 
            {
                database.collection("Companies").doc(graphValue.organization).collection("Data").doc(graphValue.parking_structure).collection("Averages").doc("Floors").collection(graphValue.floor).orderBy("Time","desc").limit(graphValue.data_amount).get().then(async function(querySnapshot) 
                {
                    querySnapshot.forEach(async function(doc)
                    {
                      
                        graphValue.occupancyData.push(doc.data()["Average"]);
                        let time =  doc.data()["Time"].toDate();
                        
                        graphValue.occupanceReadTime.push(time);
                        graphValue.occupancyTime.push((time.getTime()-(2.52*Math.pow(10,7))));
                      
                        if(i >= (graphValue.data_amount-1))
                        {
                         
                           const render_check = await graphValue.temp.render();
                           graphValue.temp.zoomX(await graphValue.occupancyTime[11],await graphValue.occupancyTime[0]);
                            if(heat_count == 0)
                                {
                                    heat_graph(); // makes heat map because it has error if heat map starts before 
                                }
                           
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
       
        generateAverageOccupancuData(graphValue);
       
                      
   }
   
}

 /**
  * creates the actual chart for user to interface with on webpage
  * @param {object} averageChart instance of average_chart class
  */
 async function generateAverageOccupancuData(averageChart)
{
    var dropdown = false;
       var dropdown_array =[];
    var options = 
    await {
        chart: 
        {   
            toolbar:{
            
           offsetX: -100,
            show:true,
            tools:{
         customIcons:  [
          {
                  icon: '<img src="images/time.svg" width="20">',
                 
                  title: 'time selection',
                  class: 'custom-icon',
               click: function(chart, options)
                 {
                  
                     function dropdown_create()
                     {
                         
                        var chartDiv =  document.getElementById("average_chart");
                        var chartDiv2 = chartDiv.getElementsByTagName("div")[0];
                        var toolbar = chartDiv2.getElementsByClassName("apexcharts-toolbar");
                         
                         var first_item = document.createElement("div");
                         dropdown_array[0]= first_item;
                         first_item.id = "item1";
                         first_item.style.paddingLeft = "5px";
                         first_item.innerHTML= "week";
                         first_item.style.cursor = "pointer";
                         first_item.onclick = function(){
                               the_averagechart.temp.zoomX(the_averagechart.occupancyTime[167],the_averagechart.occupancyTime[0]);
                               dropdown = false;
                           }
                         
                          var second_item = document.createElement("div");
                          dropdown_array.push(second_item);
                          second_item.id = "item2";
                          second_item.style.paddingLeft = "5px";
                          second_item.innerHTML= "month";
                          second_item.style.cursor = "pointer";
                          second_item.onclick = function(){
                               the_averagechart.temp.zoomX(the_averagechart.occupancyTime[743],the_averagechart.occupancyTime[0]);
                                dropdown = false;
                           }
                          
                            var third_item = document.createElement("div");
                          dropdown_array.push(third_item);
                          third_item.id = "item3";
                          third_item.style.paddingLeft = "5px";
                          third_item.innerHTML= "day";
                          third_item.style.cursor = "pointer";
                          third_item.onclick = function(){
                               the_averagechart.temp.zoomX(the_averagechart.occupancyTime[23],the_averagechart.occupancyTime[0]);
                                dropdown = false;
                           }
                           toolbar[0].appendChild(first_item);
                           toolbar[0].appendChild(second_item);
                              toolbar[0].appendChild(third_item);
                         
                         var fourth_item = document.createElement("div");
                          dropdown_array.push(fourth_item);
                          fourth_item.id = "item4";
                          fourth_item.style.paddingLeft = "5px";
                          fourth_item.innerHTML= "12hr";
                          fourth_item.style.cursor = "pointer";
                          fourth_item.onclick = function(){
                               the_averagechart.temp.zoomX(the_averagechart.occupancyTime[11],the_averagechart.occupancyTime[0]);
                                dropdown = false;
                           }
                          
                           toolbar[0].appendChild(first_item);
                           toolbar[0].appendChild(second_item);
                           toolbar[0].appendChild(third_item);
                           toolbar[0].appendChild(fourth_item);
                     }
                     
                       if(dropdown == false)
                       {  
                         //the_averagechart.offsetX = -100;
                         dropdown_create();
                       
                        dropdown =true;
                       }
                     else
                         {
                             function dropdown_remove(item,index,array)
                             {
                                 item.remove();
                             }
                             console.log(dropdown_array);
                            dropdown_array.forEach(dropdown_remove);
                            dropdown_array = [];
                            dropdown = false;
                             //document.getElementBy
                             console.log("error things")
                              
                         }
                       
                }
//                   
//                //hover: 
//      
           }
//            {
//                icon: '<img src="../public/images/loc.png" width="20">',
//                    title: 'tooltip of the icon',
//            }
//            
        ],
                zoom: false,
          zoomin: false,
          zoomout: false,
          reset: false      
            }
        },
          //selection:{
           //   enabled: true
        //  },
          height: 600,
          type: averageChart.graph_type,
//           zoom:{
//               enabled:false
//           },
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
        [
//            
            {
//               
                data: await await averageChart.occupancyData
            },
        ],
        xaxis: 
        {
          type: 'datetime',
          categories: await averageChart.occupancyTime,
        },
        legend:
        {
            show:true
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
var the_averagechart;
/** base function called by webpage that creates class object and calls function and monitors for changes  */ 
async function average_graph()
{
    /// this function should have parameters long term that makes it easy to call for any organization
    
    
    let averageChart = new average_chart;
    await averageChart.getData(averageChart);
    console.log(averageChart);
    let unsubscribe = database.collection("Companies").doc(averageChart.organization).collection("Data").doc(averageChart.parking_structure).collection("Averages").doc("Floors").collection(averageChart.floor).orderBy("Time","desc").limit(averageChart.data_amount).onSnapshot(async function(snapshot)
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
    the_averagechart = averageChart;
   
}