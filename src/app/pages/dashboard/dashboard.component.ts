import { Component } from '@angular/core';
import { BookingFormComponent } from "./booking-form/booking-form.component";
import { CommonModule } from '@angular/common';
import { ColumnRotatedComponent } from "../../shared/column-rotated/column-rotated.component";
import { PieChartComponent } from "../../shared/pie-chart/pie-chart.component";

@Component({
  selector: 'app-dashboard',
  imports: [BookingFormComponent, CommonModule, ColumnRotatedComponent, PieChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
})
export class DashboardComponent {
  showModal = false;

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
