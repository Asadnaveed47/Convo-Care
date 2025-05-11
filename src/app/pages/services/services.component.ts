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
  Math = Math;
  selectedStaff: any = null;
  staffData: any = null; 
  constructor() {}

  private apiService = inject(ApiserviceService);
  private baseUrl = environment.baseUrl;

  staffList: Staff[] = [];
  servicesList: Services[] = [];

  ngOnInit(): void {
    this.loadStaff();
    this.loadServices();
  }

  loadStaff() {
    const url = `${this.baseUrl}/api/v1/business/5/staff`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.staffList = response.data;
      }
    });
  }

  loadServices() {
    const url = `${this.baseUrl}/api/v1/business/5/services`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.servicesList = response.data;
      }
    });
  }
  openEditStaffModal(staff: any) {
    this.selectedStaff = staff; // Save the selected staff data
    this.modalType = 'staff';    // Set modal type to staff for editing
    this.staffData = this.staffList.find((s: any) => s.id === staff.id); 
    console.log("staffData", this.staffData);
    
  }
  deleteStaff(staffId: number) {
    const url = `${this.baseUrl}/api/v1/business/5/staff/${staffId}`;
    this.apiService.delete(url).subscribe(response => {
      if (response.status === 1000) {
        this.loadStaff(); 
      }
    });
  }

  // Tabs and modals
  activeTab: 'staff' | 'service' = 'staff';
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

  // Pagination - Staff
  currentPageStaff = 1;
  itemsPerPageStaff = 5;

  get totalPages(): number {
    return Math.ceil(this.staffList.length / this.itemsPerPageStaff);
  }

  shouldShowPage(page: number): boolean {
    const current = this.currentPageStaff;
    return (
      page === 1 ||
      page === this.totalPages ||
      Math.abs(current - page) <= 1
    );
  }

  // Pagination - Services
  currentPageService = 1;
  itemsPerPageService = 5;

  get totalServicePages(): number {
    return Math.ceil(this.servicesList.length / this.itemsPerPageService);
  }

  shouldShowServicePage(page: number): boolean {
    const current = this.currentPageService;
    return (
      page === 1 ||
      page === this.totalServicePages ||
      Math.abs(current - page) <= 1
    );
  }
}
