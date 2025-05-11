import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-column-rotated',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-rotated.component.html',
  styleUrl: './column-rotated.component.css'
})
export class ColumnRotatedComponent {
  chartOptions: any;
  private chart!: am4charts.XYChart;
  @Input() chartData: any[] = [];


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
    this.browserOnly(() => {
      // Dispose of previous chart if it exists
      if (this.chart) {
        this.chart.dispose();
      }

      am4core.useTheme(am4themes_animated);
      this.chart = am4core.create("chart", am4charts.XYChart);
      this.chart.scrollbarX = new am4core.Scrollbar();

      // Add data
      this.chart.data = [{
        "country": "Consultancy",
        "visits": 10
      }, {
        "country": "Therapy",
        "visits": 7
      }, {
        "country": "X-ray",
        "visits": 46
      }, {
        "country": "Ultrasound",
        "visits": 34
      }, {
        "country": "Endoscopy",
        "visits": 5
      }, {
        "country": "CT Scan",
        "visits": 3
      }];

      // Create axes
      let categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.labels.template.rotation = 270;
      categoryAxis.renderer.minHeight = 110;

      let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 50;

      // Create series
      let series = this.chart.series.push(new am4charts.ColumnSeries());
      series.sequencedInterpolation = true;
      series.dataFields.valueY = "visits";
      series.dataFields.categoryX = "country";
      series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
      series.columns.template.strokeWidth = 0;

      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.fillOpacity = 0.8;

      // on hover, make corner radiuses bigger
      let hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.fillOpacity = 1;

      series.columns.template.adapter.add("fill", (fill, target) => {
        return target.dataItem ? this.chart.colors.getIndex((target.dataItem as am4charts.ColumnSeriesDataItem).index) : fill;
      });

      // Cursor
      this.chart.cursor = new am4charts.XYCursor();
    })
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  browserOnly(fn: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      fn();
    }
  } 
}
