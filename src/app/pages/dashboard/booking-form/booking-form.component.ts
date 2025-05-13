import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ApiserviceService } from '../../../services/apiservice/apiservice.service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  @Input() bookingToEdit?: any;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() show = new EventEmitter<void>();
  @Input() appointmentData: any;

  bookingForm: FormGroup;
  private baseUrl = environment.baseUrl;

  serviceList: any[] = [];
  staffList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiserviceService
  ) {
    this.bookingForm = this.fb.group({
      service: ['', Validators.required],
      staff: ['', Validators.required],
      customer_name: ['', [Validators.required, Validators.minLength(2)]],
      customer_email: ['', [Validators.required, Validators.email]],
      customer_phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{9,15}$/)]],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      // status: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.getStaff();
    this.getServices();
    console.log("appointmentData",this.appointmentData);
    
 if (!!this.appointmentData) {
  this.bookingForm.patchValue({
    service: this.appointmentData.service || '', // Ensuring a default value if it's null or undefined
    staff: this.appointmentData.staff || '', // Same here for the staff name
    customer_name: this.appointmentData.customer?.name || '', // Handle undefined or null customer data
    customer_email: this.appointmentData.customer?.email || '', // Default to empty string if no email
    customer_phone: this.appointmentData.customer?.phone || '', // Same for phone number
    start_time: this.appointmentData.start_time ? new Date(this.appointmentData.start_time) : null, // Only set the date if available
    end_time: this.appointmentData.end_time ? new Date(this.appointmentData.end_time) : null, // Same for end_time
    status: this.appointmentData.appointment_status || '', // Default to empty string if no status
    notes: this.appointmentData.notes || '' // Default to empty string if no notes
  });
}

  }
 getStaff() {
    const url = `${this.baseUrl}/api/v1/business/5/staff`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.staffList = response.data;
      }
    });
  }

  getServices() {
    const url = `${this.baseUrl}/api/v1/business/5/services`;
    this.apiService.get(url).subscribe(response => {
      if (response.status === 1000) {
        this.serviceList = response.data;
      }
    });
  }
 onSubmit(): void {
  console.log('bookingForm', this.bookingForm);

  this.markFormGroupTouched(this.bookingForm);

  const fd = this.bookingForm.value;

  if (!this.bookingForm.valid) {
    return;
  }

const formatToISOString = (date: string | Date) =>
  new Date(date).toISOString().slice(0, 19) + 'Z';

const payload = {
  service: 41,
  staff: 10,
  customer: {
    name: fd.customer_name,
    email: fd.customer_email,
    phone: fd.phone_number,
  },
  start_time: formatToISOString(fd.start_time),
  end_time: formatToISOString(fd.end_time),
  notes: fd.notes,
};


  const businessId = 5;

  console.log('appointmentData', this.appointmentData);
  console.log('payload', payload);

  if (this.appointmentData && this.appointmentData.id) {
    const url = `${this.baseUrl}/api/v1/business/${businessId}/appointment/${this.appointmentData.id}`;
    this.updateAppointment(url, payload);
  } else {
    const url = `${this.baseUrl}/api/v1/business/${businessId}/appointments`;
    this.createAppointment(url, payload);
  }
}

updateAppointment(url: string, payload: any): void {
  this.apiService.edit(url, payload).subscribe({
    next: () => this.handleSuccess(),
    error: (err) => {
      console.error('Update error:', err);
    }
  });
}

createAppointment(url: string, payload: any): void {
  this.apiService.create(url, payload).subscribe({
    next: () => this.handleSuccess(),
    error: (err) => {
      console.error('Create error:', err);
    }
  });
}

  
  private handleSuccess(): void {
    this.bookingForm.reset();
    this.onClose();
  }
  
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

  onClose(): void {
    this.modalClosed.emit();
    this.bookingForm.reset();
    this.show.emit();
    this.bookingToEdit = null;
    
  }
}
