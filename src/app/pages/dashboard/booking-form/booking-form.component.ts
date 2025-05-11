import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ApiserviceService } from '../../../services/apiservice/apiservice.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  @Input() bookingToEdit?: any;
  @Output() close = new EventEmitter<void>();
  @Output() show = new EventEmitter<void>();
  @Input() appointmentData: any;

  bookingForm: FormGroup;
  private baseUrl = environment.baseUrl;

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
      status: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    console.log("appointmentData",this.appointmentData);
    
    if (this.appointmentData) {
      this.bookingForm.patchValue({
        service: this.appointmentData.service_name,
        staff: this.appointmentData.staff_name,
        customer_name: this.appointmentData.customer_name,
        customer_email: this.appointmentData.customer_email,
        customer_phone: this.appointmentData.customer_phone,
        start_time: this.appointmentData.start_time,
        end_time: this.appointmentData.end_time,
        status: this.appointmentData.appointment_status,
        notes: this.appointmentData.notes
      });
    }
  }

  onSubmit(): void {
    if (!this.bookingForm.valid) {
      this.markFormGroupTouched(this.bookingForm);
      return;
    }

    const payload = this.bookingForm.value;

    if (this.bookingToEdit?.id) {
      const url = `${this.baseUrl}/api/v1/business/5/appointments/${this.bookingToEdit.id}`;
      this.apiService.edit(url, payload).subscribe({
        next: () => {
          this.bookingForm.reset();
          this.closeModal();
        },
        error: (err) => console.error('Error updating booking:', err)
      });
    } else {
      const url = `${this.baseUrl}/api/v1/business/5/appointments`;
      this.apiService.create(url, payload).subscribe({
        next: () => {
          this.bookingForm.reset();
          this.closeModal();
        },
        error: (err) => console.error('Error creating booking:', err)
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

  closeModal(): void {
    this.close.emit();
  }
}
