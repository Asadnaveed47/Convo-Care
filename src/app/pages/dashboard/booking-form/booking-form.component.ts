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
  // @Input() show = false;
  @Input() bookingToEdit?: any;
  @Output() close = new EventEmitter<void>();
  @Output() show = new EventEmitter<void>();

  bookingForm: FormGroup;
  private baseUrl = environment.baseUrl;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiserviceService
  ) {
    this.bookingForm = this.fb.group({
      service: ['', Validators.required],
      staff: ['', Validators.required],
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+]{9,15}$/)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.bookingToEdit) {
      this.bookingForm.patchValue({
        service: this.bookingToEdit.service,
        staff: this.bookingToEdit.staff,
        customerName: this.bookingToEdit.customerName,
        customerEmail: this.bookingToEdit.customerEmail,
        customerPhone: this.bookingToEdit.customerPhone,
        startTime: this.bookingToEdit.startTime,
        endTime: this.bookingToEdit.endTime,
        status: this.bookingToEdit.status,
        notes: this.bookingToEdit.notes
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
      const url = `${this.baseUrl}/api/v1/bookings/${this.bookingToEdit.id}`;
      this.apiService.edit(url, payload).subscribe({
        next: () => {
          this.bookingForm.reset();
          this.closeModal();
        },
        error: (err) => console.error('Error updating booking:', err)
      });
    } else {
      const url = `${this.baseUrl}/api/v1/bookings`;
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
