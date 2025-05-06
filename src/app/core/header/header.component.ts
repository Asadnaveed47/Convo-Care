import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BusinessFormComponent } from "../../pages/business-form/business-form.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,

  imports: [CommonModule, BusinessFormComponent],
})
export class HeaderComponent {
  showModal = false;

  addBusiness() {
    this.showModal = true;    
  }

  closeModal() {
    this.showModal = false;
  }

  handleBookingAdded(newStaff: any) {
  }
}
