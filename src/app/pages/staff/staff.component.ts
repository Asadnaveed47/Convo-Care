import { Component } from '@angular/core';
import { StaffFormComponent } from "./staff-form/staff-form.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff',
  imports: [StaffFormComponent,CommonModule ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {
  showModal = false;

  addStaff() {
    this.showModal = true;
    console.log('Add staff button clicked');
    
  }

  closeModal() {
    this.showModal = false;
  }

  handleStaffAdded(newStaff: any) {
    console.log('New staff added:', newStaff);
  }
}
