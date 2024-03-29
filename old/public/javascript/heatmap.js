//
//  heatmap.js
//  Raedam 
//
//  Created on 9/25/2020. Modified on 1/30/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for floor heat map
var heat_count = 0;
 

/**
 * Returns percent of time spot is occupied 
 * @param {number} spotID id of spot you want to get the percent for 
 */
async function get_percent(spotID)
{   
   var percent = database.collection("Companies").doc("Portland State University").collection("Data").doc("Parking Structure 1").collection("Floor 2").doc(spotID).collection("Data").orderBy("Time.End", "desc").get().then(async function(querySnapshot) 
    {
       var percent = 0;
        var heat_occupied = 0;
        var heat_unoccupied = 0;
        querySnapshot.forEach(async function(doc) 
        {
           
            var the_length = doc.data().Distances;// amount of logs in a row of that type
            the_length = the_length.length;
           
            if(doc.data().Occupied)
                {
                    
                    heat_occupied+= the_length;
                }
            else{
               
                heat_unoccupied+= the_length;
            }})
            
     if(await heat_occupied == 0)
     {
            percent = 0;
     }
      else if(heat_unoccupied == 0)
      {
            percent = 100;
      }
      else
      {
            percent =Math.floor(heat_occupied/(heat_occupied+heat_unoccupied)*100);
      }
   
        return await percent;
        
           
     })

 
  
           
         return percent;
}
/**
 * heat_map class is class object that holds information for heat map graph  
 */
class heat_map
{
    constructor()
    {
        this.data_amount = 1;
        this.chart = null;
        this.min = 0;
        this.max = 100;
        this.data =[];
        this.data_string ="";
        this.spot_count = 9;
        this.spotIDs =[];
        
    }
    async heat(heat_object)
    {
        // temporary while spots are ids 1-9 will need to change format when ids are not in order
        for(let i=0; i<this.spot_count; i+=1)
            {
                this.spotIDs.push(i+1);
                this.data[i]= await get_percent(String(i+1));
           
                
            }
        
      
        heatmap_create(heat_object);

    }
   
    
}
/**
 * Creates heatmap on webpage using heat map object
 * @param {class heat_map} myChart instance of heat map object
 */
  async function heatmap_create(myChart)
{
    
        var options = {
          
          chart: {
          height: 350,
          type: 'heatmap',
        },
        plotOptions: {
          heatmap: {
             
              enableShades: true,
            shadeIntensity:0.9,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: [{
                  from: 0,
                  to: 25,
                  name: '0-25%',
                  color: '#abadb0'
                },
                {
                  from: 26,
                  to: 50,
                  name: '26-50%',
                  color: '#afff5e'
                },
                {
                  from: 51,
                  to: 75,
                  name: '51%-75%',
                  color: '#FFFF00'
                },
                {
                  from: 76,
                  to: 100,
                  name: '76%-100%',
                  color: '#FF0000'
                },
              
              ]
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        legend:{
            show: true,
            showForSingleSeries: true,
        },
        stroke: {
          width: 1
        },
        series: 
        
       [{  name: "",
           data:  await myChart.data
                 
        }],
            xaxis:
            {
              categories:await myChart.spotIDs  
            },
        title: {
          text: 'HeatMap - Structure 1,Floor 2'
        },
        };

        var chart = new ApexCharts(document.querySelector("#heat_chart"),  await options);
        console.log(myChart.data)

       myChart.chart =  chart;
       await myChart.chart.render();
    
}
// has to be called after average if on same page for some reason
/**
 * creates heat_map object and calls functions to display it on webpage
 */ 
 async function heat_graph()
{
     heat_count = 1;
    var myChart = new heat_map;
   
    myChart.heat(await myChart);
    console.log(await myChart.data);
}