import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffFormModalComponent } from "./staff-form-modal/staff-form-modal.component";
import { ServiceFormModalComponent } from "./service-form-modal/service-form-modal.component";
import { Staff } from '../../models/staff/staff';
import { Services } from '../../models/services/services';
import { ApiserviceService } from '../../services/apiservice/apiservice.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, StaffFormModalComponent, ServiceFormModalComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  constructor() { }

  private apiService = inject(ApiserviceService);
  private baseUrl = environment.baseUrl;

  staffList: Staff[] = [];
  servicesList: Services[] = [];

  ngOnInit(): void {
    this.loadStaff();
    this.loadServices();
  }

  loadStaff() {
    const url = `${this.baseUrl}/api/v1/businesses/5/staff`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.staffList = response.data;
      }
    });
  }

  loadServices() {
    const url =  `${this.baseUrl}/api/v1/businesses/5/services`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.servicesList = response.data;
      }
    });
  }

  // ------------------------------------------ //

  activeTab: 'staff' | 'service' = 'staff'; 

  // ------------------------------------------ //

  modalType: 'staff' | 'service' | null = null;

  openStaffModal() {
    this.modalType = 'staff';
  }

  openServiceModal() {
    this.modalType = 'service';
  }

  closeModal() {
    this.modalType = null;
  }
}
