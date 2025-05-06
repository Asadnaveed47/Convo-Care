import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-pie-chart',
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent {
  chartOptions: any;

  constructor() {
    this.chartOptions = {
      // Add your chart options here
    };
  }
  ngOnInit() {
    this.generateChart(this.chartOptions);
  }
  ngOnChanges() {
    this.generateChart(this.chartOptions);
  }
  generateChart(chartOptions: any) {
    let chartData: { [key: string]: { sector: string; size: number; }[] } = {
      "1995": [
        { "sector": "New Patient", "size": 6.6 },
        { "sector": "Repeative Patient", "size": 0.6 },],

    };
    
    // Create chart instance
    let chart = am4core.create("pie-chart", am4charts.PieChart);
    
    // Add data
    chart.data = [
      { "sector": "New Patient", "size": 6.6 },
      { "sector": "Repeative Patient", "size": 0.6 },
  
    ];
    
    // Add label
    chart.innerRadius = 100;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "1995";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 50;
    
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "size";
    pieSeries.dataFields.category = "sector";
    
    // Animate chart data
    let currentYear = 1995;
    function getCurrentData() {
      label.text = currentYear.toString();
      let data = chartData[currentYear.toString()];
      currentYear++;
      if (currentYear > 2014)
        currentYear = 1995;
      return data;
    }
    
    function loop() {
      //chart.allLabels[0].text = currentYear;
      let data = getCurrentData();
      for(var i = 0; i < data.length; i++) {
        chart.data[i].size = data[i].size;
      }
      chart.invalidateRawData();
      chart.setTimeout( loop, 4000 );
    }
    
    loop();
  }

}
