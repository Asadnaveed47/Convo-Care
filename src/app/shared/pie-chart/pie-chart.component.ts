import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class PieChartComponent implements OnInit, OnChanges {
  @Input() insightData: any = {};
  chart: am4charts.PieChart | undefined;

  ngOnInit() {
    this.generateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['insightData'] && !changes['insightData'].firstChange) {
      this.generateChart();
    }
  }

  generateChart() {
    if (this.chart) {
      this.chart.dispose(); // Destroy previous chart instance
    }
  
    // Create chart instance
    let chart = am4core.create("pie-chart", am4charts.PieChart);
    this.chart = chart;
  
    // Extract patient data from input
    const newPatients = this.insightData?.new_customers || 0;
    const repeatPatients = this.insightData?.old_customers || 0;
  
    // Set up chart data
    let chartData = [];
  
    if (newPatients === 0 && repeatPatients === 0) {
      chartData = [
        { sector: "No Data", size: 0 }
      ];
    } else {
      chartData = [
        { sector: "New Patient", size: newPatients },
        { sector: "Repeat Patient", size: repeatPatients }
      ];
    }
  
    // Assign data to chart
    chart.data = chartData;
  
    // Add inner radius and center label
    chart.innerRadius = am4core.percent(40);
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = "Today";
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;
  
    // Configure Pie Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "size";
    pieSeries.dataFields.category = "sector";
  
    // Tooltip shows actual value
    pieSeries.slices.template.tooltipText = "{category}: {value}";
  
    // Labels show actual value instead of percentage
    pieSeries.labels.template.text = "{value}";
  
    // Optional: animation settings
    pieSeries.hiddenState.properties.opacity = 0;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
  }  
}