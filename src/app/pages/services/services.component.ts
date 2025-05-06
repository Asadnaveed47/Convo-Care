import { Component } from '@angular/core';
import { StaffFormModalComponent } from "./staff-form-modal/staff-form-modal.component";
import { ServiceFormModalComponent } from "./service-form-modal/service-form-modal.component";

@Component({
  selector: 'app-services',
  standalone: true, 
  imports: [StaffFormModalComponent, ServiceFormModalComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
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
