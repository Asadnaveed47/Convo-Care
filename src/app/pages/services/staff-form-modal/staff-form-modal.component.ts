import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { ApiserviceService } from '../../../services/apiservice/apiservice.service';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Staff } from '../../../models/staff/staff';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-form-modal',
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './staff-form-modal.component.html',
  styleUrl: './staff-form-modal.component.css'
})
export class StaffFormModalComponent implements OnInit {
  private apiService = inject(ApiserviceService);
  private baseUrl = environment.baseUrl;

  @Input() show = false;
  @Input() staffToEdit?: Staff;
  @Output() close = new EventEmitter<void>();

  staffForm!: FormGroup;
  timeRanges: { start: string, end: string }[] = [];
  showTimePicker = false;
  newStartTime = '';
  newEndTime = '';

  constructor(private fb: FormBuilder) {
    this.staffForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      workingHours: ['', [Validators.required]],
      max_appointments_per_day: ['', [Validators.required]],
      language: [[], [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      expertise: [[], [Validators.required]],
      bio: ['', [Validators.required]],
      blockTimes: ['', [Validators.required]],
      allocated_services: this.fb.array([this.createServiceGroup()])
    })
  }

  ngOnInit(): void {
    if (this.staffToEdit) {
      this.staffForm.patchValue({
        name: this.staffToEdit.name,
        email: this.staffToEdit.email,
        workingHours: this.staffToEdit.workingHours,
        max_appointments_per_day: this.staffToEdit.max_appointments_per_day,
        language: this.staffToEdit.language,
        phoneNumber: this.staffToEdit.phoneNumber,
        expertise: this.staffToEdit.expertise,
        bio: this.staffToEdit.bio,
        blockTimes: this.staffToEdit.block_times,
        allocated_services: this.staffToEdit.allocated_services
      })
    }
  }

  createServiceGroup(): FormGroup {
    return this.fb.group({
      service: [null],
      duration: [''],
      price: ['']
    });
  }

  get allocated_services(): FormArray {
    return this.staffForm.get('allocated_services') as FormArray;
  }

  addAllocatedService(): void {
    if (this.allocated_services.length < 3) {
      this.allocated_services.push(this.createServiceGroup());

    }
  }

  removeService(index: number): void {
    if (this.allocated_services.length > 1) {
      this.allocated_services.removeAt(index);
    }
  }

  onClose() {
    this.close.emit();
  }

  createStaff(url: string, payload: Staff): void {
    this.apiService.create(url, payload).subscribe({
      next: (resp) => {
        console.log('Staff created:', resp);
        this.staffForm.reset();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating service:', err);
      }
    })
  }

  updateStaff(url: string, payload: Staff): void {
    this.apiService.edit(url, payload).subscribe({
      next: (resp) => {
        console.log('Staff updated:', resp);
        this.staffForm.reset();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating service:', err);
      }
    })
  }

  closeModal(): void {
    this.close.emit();
  }

  onSubmit() {
    if (!this.staffForm.valid) {
      this.markFormGroupTouched(this.staffForm);
      return;
    }

    const formValue = this.staffForm.value;
    const payload: any = {
      name: formValue.name,
      email: formValue.email,
      workingHours: formValue.workingHours,
      max_appointments_per_day: formValue.max_appointments_per_day,
      language: formValue.language,
      phoneNumber: formValue.phoneNumber,
      expertise: formValue.expertise,
      bio: formValue.bio,
      blockTimes: formValue.blockTimes,
      allocated_services: formValue.allocated_services
    }

    if (this.staffToEdit?.id) {
      const url = `${this.baseUrl}/api/v1/businesses/5/staff/${this.staffToEdit.id}`;
      this.updateStaff(url, payload);
    } else {
      const url = `${this.baseUrl}/api/v1/businesses/5/staff`;
      this.createStaff(url, payload);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  expertise = [
    { id: 1, name: 'X-ray' },
    { id: 2, name: 'Consultation' }
  ];


  languages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Urdu' },
    { id: 3, name: 'Spanish' },
  ];

  services = [
    { id: 1, name: 'Generic Consultation' },
    { id: 2, name: 'Daily Consultation' },
    { id: 3, name: 'Generic Consultation' }

  ];

  selectedLanguage: any = null;

  selectedExpertise: any = null;
  selectedMultipleExpertise: any[] = [];

  
  // Open the popup
  openTimeRangePicker() {
    this.newStartTime = '';
    this.newEndTime = '';
    this.showTimePicker = true;
  }
  
  // Close popup
  closeTimePicker() {
    this.showTimePicker = false;
  }
  
  // Add the selected time range to the list
  addTimeRange() {
    if (this.newStartTime && this.newEndTime) {
      this.timeRanges.push({ start: this.newStartTime, end: this.newEndTime });
      this.updateWorkingHoursForm();
      this.closeTimePicker();
    }
  }
  
  // Remove specific range
  removeRange(index: number) {
    this.timeRanges.splice(index, 1);
    this.updateWorkingHoursForm();
  }
  
  // Update hidden input value
  updateWorkingHoursForm() {
    const timeStrings = this.timeRanges.map(r => `${r.start} - ${r.end}`);
    this.staffForm.get('workingHours')?.setValue(timeStrings.join(', '));
  }
  
}
