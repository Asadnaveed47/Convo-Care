import { Component } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonModule } from '@angular/common';
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-column-rotated',
  imports: [CommonModule],
  templateUrl: './column-rotated.component.html',
  styleUrl: './column-rotated.component.css'
})
export class ColumnRotatedComponent {
chartOptions: any;
  constructor() {
  }
  ngOnInit(){
  }
  ngOnChanges() {
    // console.log("chartOption mutli:",this.chartOptions)
    this.generateChart(this.chartOptions);    
  }
  generateChart(chartOptions: any) {
  let chart = am4core.create("chart", am4charts.XYChart);
  chart.scrollbarX = new am4core.Scrollbar();
  
  // Add data
  chart.data = [{
    "country": "USA",
    "visits": 3025
  }, {
    "country": "China",
    "visits": 1882
  }, {
    "country": "Japan",
    "visits": 1809
  }, {
    "country": "Germany",
    "visits": 1322
  }, {
    "country": "UK",
    "visits": 1122
  }, {
    "country": "France",
    "visits": 1114
  }, {
    "country": "India",
    "visits": 984
  }, {
    "country": "Spain",
    "visits": 711
  }, {
    "country": "Netherlands",
    "visits": 665
  }, {
    "country": "Russia",
    "visits": 580
  }, {
    "country": "South Korea",
    "visits": 443
  }, {
    "country": "Canada",
    "visits": 441
  }];
  
  // Create axes
  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "country";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 30;
  categoryAxis.renderer.labels.template.horizontalCenter = "right";
  categoryAxis.renderer.labels.template.verticalCenter = "middle";
  categoryAxis.renderer.labels.template.rotation = 270;
  if (categoryAxis.tooltip) {
    categoryAxis.tooltip.disabled = true;
  }
  categoryAxis.renderer.minHeight = 110;
  
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.minWidth = 50;
  
  // Create series
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.sequencedInterpolation = true;
  series.dataFields.valueY = "visits";
  series.dataFields.categoryX = "country";
  series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
  series.columns.template.strokeWidth = 0;
  
  if (series.tooltip) {
    series.tooltip.pointerOrientation = "vertical";
  }
  
  series.columns.template.column.cornerRadiusTopLeft = 10;
  series.columns.template.column.cornerRadiusTopRight = 10;
  series.columns.template.column.fillOpacity = 0.8;
  
  // on hover, make corner radiuses bigger
  let hoverState = series.columns.template.column.states.create("hover");
  hoverState.properties.cornerRadiusTopLeft = 0;
  hoverState.properties.cornerRadiusTopRight = 0;
  hoverState.properties.fillOpacity = 1;
  
  series.columns.template.adapter.add("fill", function(fill, target) {
    return target.dataItem ? chart.colors.getIndex(target.dataItem.index) : am4core.color("#cccccc");
  });
  
  // Cursor
  chart.cursor = new am4charts.XYCursor();
}
}
