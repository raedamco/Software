//
//  heatmap.js
//  Raedam 
//
//  Created on 9/25/2020. Modified on 10/5/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for floor heat map
var heat_count = 0;
 
   // heat_occupied[9]= 1;
   // heat_unoccupied[9]= 1;

async function get_percent(spotID)
{   
   var percent = database.collection("PSU").doc("Parking Structure 1").collection("Floor 2").doc(spotID).collection("Data").orderBy("Time.End", "desc").get().then(async function(querySnapshot) 
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
                    //await occupied_counter(spotID, the_length);
                   // the_heatmap.total_occupied = the_heatmap.total_occupied+ the_length;
                    //console.log(the_heatmap.total_occupied);
                    heat_occupied+= the_length;
                }
            else{
                //the_heatmap.total_unoccupied = the_heatmap.total_unoccupied +the_length;
                //await unoccupied_counter(spotID,the_length);
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
        console.log(percent);
        return percent;
        
           // call function that uses percentage
     })

 
   //return get_percent(spotID);
           
         return percent;
}
/*
async function occupied_counter(spotid, num)
{   if(heat_occupied.get(spotid) != null)
    {
         heat_occupied.set(spotid,num); 
    }
    else{
         let temp = heat_occupied.get(spotid);
         temp+= num;
         heat_occupied.set(spotid,temp); 
    }
}
async function unoccupied_counter(spotid, num)
{   
  if(heat_unoccupied.get(spotid) != null)
    {
         heat_unoccupied.set(spotid,num); 
    }
    else{
         let temp = heat_unoccupied.get(spotid);
         temp+= num;
         heat_unoccupied.set(spotid,temp); 
    }
}
async function get_percent(spotID)
{
    console.log(heat_occupied.get(spotID));
     if(await heat_occupied.get(spotID) == 0)
     {
            percent = 0;
     }
      else if(heat_unoccupied.get(spotID)== 0)
      {
            percent = 100;
      }
      else
      {
            percent = heat_occupied.get(spotID)/(heat_occupied.get(spotID)+heat_unoccupied.get(spotID));
      }
    return percent;
}
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
//        this.total_occupied =0;
//        this.total_unoccupied=0;
//        this.spotID = "9";
        // heat_occupied[9]+= 1;
        
    }
    async heat(heat_object)
    {
      /*
        this.jan_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.feb_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.mar_data = generateData(heat_object.data_amount,this.min,this.max);
        this.apr_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.may_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.jun_data = generateData(heat_object.data_amount,this.min,this.max);
        this.july_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.aug_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.sep_data = generateData(heat_object.data_amount,this.min,this.max);
       */
        for(let i=0; i<this.spot_count; i+=1)
            {
              this.data[i]= get_percent(String(i+1));
                //console.log(this.data[i])
                //console.log(get_percent(String(i+1)));
            }
        for(let i=0; i<this.spot_count; i+=1)
            {
                if(i == 0)
                {
                    this.data_string = this.data_string.concat(
                        "[  \n "+
                        "{  \n"+
                        " name: " + String(i+1) + ", \n "+
                         "data: "+ String(await this.data[i])+ " \n"+
                        "}, \n"
                        
                    )
                }
                else if( i == (this.spot_count-1))
                    {
                        this.data_string = this.data_string.concat(
                 
                        "{  \n"+
                       " name: " + String(i+1) + ", \n "+
                         "data: " +String(await this.data[i])+ " \n"+
                        "} ]; \n"
                )
                    }
                else {

                this.data_string = this.data_string.concat(
                   
                        "{  \n"+
                        " name: " + String(i+1) + ", \n "+
                         "data: "+ String(await this.data[i])+ " \n"+
                        "}, \n"
                )
                }
        }
        console.log(this.data_string)
        heatmap_test(heat_object);
       
    }
   
    
}




function generateData(num_count, min,max)
{
    var data_array= [];
    for(i=num_count; i>0; i-=1)
    {
        var temp = Math.random() * (max - min + 1) + min;
        temp = Math.floor(temp);
        data_array.push(temp);    
    }
    return data_array;
}
var the_series = [{
            name: 'Jan',
            data: generateData(20,0,100)
          },
          {
            name: 'Feb',
            data: generateData(20,0,100)
          },
          {
            name: 'Mar',
            data: generateData(20,0,100)
          },
          {
            name: 'Apr',
            data: generateData(20,0,100)
          } ] ;
//test_gendata = generateData(20,-30,55);
//console.log(test_gendata);
  async function heatmap_test(myChart)
{
     console.log("was here oct 2020", myChart.data);
        var options = {
          series: [{name: 'row 1',
                   data: myChart.data // issue here
                  }],
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
        stroke: {
          width: 1
        },
        title: {
          text: 'HeatMap Chart with Color Range'
        },
        };

        var chart = new ApexCharts(document.querySelector("#heat_chart"),  await options);
    
        //chart.render();
       myChart.chart =  chart;
       await myChart.chart.render();
}
// has to be called after average if on same page for some reason 
 function heat_graph()
{
     heat_count = 1;
    var myChart = new heat_map;
   
    myChart.heat(myChart);
    console.log(myChart.chart);
}