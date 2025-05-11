import { Component } from '@angular/core';
import { BookingFormComponent } from "./booking-form/booking-form.component";
import { CommonModule } from '@angular/common';
import { ColumnRotatedComponent } from "../../shared/column-rotated/column-rotated.component";
import { PieChartComponent } from "../../shared/pie-chart/pie-chart.component";
import { ApiserviceService } from '../../services/apiservice/apiservice.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  imports: [BookingFormComponent, CommonModule, ColumnRotatedComponent, PieChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
})
export class DashboardComponent {
  showModal = false;
  cardDataMap: any = {};
  graphData: any[] = [];
  constructor(
    private apiService: ApiserviceService,

  ){
  }

  ngOnInit(){
  this.getCards();
  this.getgraphs();
  }

  getCards() {
    const url = `${environment.baseUrl}/api/v1/analytics/cards?dashboard_id=MD&business_id=5`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.cardDataMap = response.data.reduce((acc: any, item: any) => {
          acc[item.code] = item.data;
          return acc;
        }, {});
      }
    });
  }
  getgraphs() {
    const url = `${environment.baseUrl}/api/v1/analytics/graphs?dashboard_id=MD&business_id=5`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.graphData = response.data;
      }
    });
  }

  addBooking() {
    this.showModal = true;
    console.log('Add Booking button clicked');
    
  }

  closeModal() {
    this.showModal = false;
  }

  handleBookingAdded(newStaff: any) {
    console.log('New Booking added:', newStaff);
  }
}
