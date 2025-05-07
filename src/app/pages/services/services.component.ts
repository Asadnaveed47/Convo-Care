import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffFormModalComponent } from "./staff-form-modal/staff-form-modal.component";
import { ServiceFormModalComponent } from "./service-form-modal/service-form-modal.component";

import { StaffService } from '../../service/staff/staff.service';
import { Staff } from '../../models/staff/staff';

import { ServicesService } from '../../service/services/services.service';
import { Services } from '../../models/services/services';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, StaffFormModalComponent, ServiceFormModalComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  constructor() { }

  private staffService = inject(StaffService);
  private servicesService = inject(ServicesService);

  staffList: Staff[] = [];
  servicesList: Services[] = [];

  ngOnInit(): void {
    this.loadStaff();
    this.loadServices();
  }

  loadStaff() {
    this.staffService.getAllStaff().subscribe(response => {
      if (response.status === 1000) {
        this.staffList = response.data;
      }
    });
  }

  loadServices() {
    this.servicesService.getAllServices().subscribe(response => {
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
