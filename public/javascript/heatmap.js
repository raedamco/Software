//
//  heatmap.js
//  Raedam 
//
//  Created on 9/25/2020. Modified on 10/5/2020 by Austin Mckee.
//  Copyright © 2020 Raedam. All rights reserved.
//
// This file holds code for floor heat map
var heat_count = 0;
class heat_map
{
    constructor()
    {
        this.data_amount = 20;
        this.chart = null;
        this.min = 0;
        this.max = 100;
    }
    heat(heat_object)
    {
        this.jan_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.feb_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.mar_data = generateData(heat_object.data_amount,this.min,this.max);
        this.apr_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.may_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.jun_data = generateData(heat_object.data_amount,this.min,this.max);
        this.july_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.aug_data =  generateData(heat_object.data_amount,this.min,this.max);
        this.sep_data = generateData(heat_object.data_amount,this.min,this.max);
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

//test_gendata = generateData(20,-30,55);
//console.log(test_gendata);
  function heatmap_test(myChart)
{
     console.log("was here oct 2020");
        var options = {
          series: [{
            name: 'Jan',
            data:  myChart.jan_data,
          },
          {
            name: 'Feb',
            data:  myChart.feb_data,
          },
          {
            name: 'Mar',
            data:  myChart.mar_data,
          },
          {
            name: 'Apr',
            data:  myChart.apr_data,
          },
          {
            name: 'May',
            data:  myChart.may_data,
          },
          {
            name: 'Jun',
            data:   myChart.jun_data,
          },
          {
            name: 'Jul',
            data:  myChart.july_data,
          },
          {
            name: 'Aug',
            data:  myChart.aug_data,
          },
          {
            name: 'Sep',
            data:  myChart.sep_data,
          }
        ],
          chart: {
          height: 350,
          type: 'heatmap',
        },
        plotOptions: {
          heatmap: {
              enableShades: true,
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: [{
                  from: 0,
                  to: 33,
                  name: 'low',
                  color: '#00A100'
                },
                {
                  from: 34,
                  to: 66,
                  name: 'medium',
                  color: '#128FD9'
                },
                {
                  from: 67,
                  to: 100,
                  name: 'high',
                  color: '#FFB200'
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

        var chart = new ApexCharts(document.querySelector("#heat_chart"),  options);
    
        //chart.render();
       myChart.chart =  chart;
       myChart.chart.render();
}
// has to be called after average if on same page for some reason 
 function heat_graph()
{
     heat_count = 1;
    var myChart = new heat_map;
    myChart.heat(myChart);
    console.log(myChart.chart);
}