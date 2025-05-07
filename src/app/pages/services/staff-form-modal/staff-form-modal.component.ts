import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from '../../../service/staff/staff.service';
import { Staff } from '../../../models/staff/staff';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-form-modal',
  imports: [CommonModule],
  templateUrl: './staff-form-modal.component.html',
  styleUrl: './staff-form-modal.component.css'
})
export class StaffFormModalComponent {
  private staffService = inject(StaffService);
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  staffForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      workingHours: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      language: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      expertise: ['', [Validators.required]],
      bio: ['', [Validators.required]],
      blockTimes: ['', [Validators.required]],
      maxAppointments: ['', [Validators.required]]
    })
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.staffForm.valid) {
      const staffData: Staff = this.staffForm.value; 
      this.staffService.createStaff(staffData).subscribe({
        next: (response) => {
          console.log('Staff created successfully:', response);
          this.onClose(); 
        },
        error: (error) => {
          console.error('Error creating staff:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
