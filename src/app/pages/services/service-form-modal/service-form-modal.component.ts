import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';
import { ApiserviceService } from '../../../services/apiservice/apiservice.service';
import { Services } from '../../../models/services/services';

@Component({
  selector: 'app-service-form-modal',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './service-form-modal.component.html',
  styleUrl: './service-form-modal.component.css'
})
export class ServiceFormModalComponent implements OnInit {
  @Input() show = false;
  @Input() serviceToEdit?: Services;
  @Output() close = new EventEmitter<void>();

  serviceForm: FormGroup;
  private baseUrl = environment.baseUrl;
  errorMessage: string = '';

  categories = [
    { id: 5, name: 'General Medicine' },
    { id: 9, name: 'Diagnostics & Lab Testing' },
    { id: 6, name: 'Pediatrics' },
    { id: 7, name: 'Gynecology & Womens Health' },
    { id: 8, name: 'Dermatology' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiserviceService
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: [[], Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.serviceToEdit) {
      this.serviceForm.patchValue({
        name: this.serviceToEdit.name,
        category: this.serviceToEdit.category,
        description: this.serviceToEdit.description,
      });
    } else {
      this.serviceForm.reset();
    }
  }

  onSubmit(): void {
    if (!this.serviceForm.valid) {
      this.markFormGroupTouched(this.serviceForm);
      return;
    }

    const formValue = this.serviceForm.value;
    const payload: any = {
      name: formValue.name,
      category: formValue.category,
      description: formValue.description,
      status: formValue.status
    };

    if (this.serviceToEdit?.id) {
      const url = `${this.baseUrl}/api/v1/business/5/services/${this.serviceToEdit.id}`;
      this.updateService(url, payload);
    } else {
      const url = `${this.baseUrl}/api/v1/business/5/services`;
      this.createService(url, payload);
    }
  }

  createService(url: string, payload: Services): void {
    this.apiService.create(url, payload).subscribe({
      next: (resp) => {
        console.log('Service created:', resp);
        this.serviceForm.reset();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating service:', err);
        this.errorMessage = err?.error?.message;
      }
    });
  }

  updateService(url: string, payload: Services): void {
    this.apiService.edit(url, payload).subscribe({
      next: (resp) => {
        console.log('Service updated:', resp);
        this.serviceForm.reset();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating service:', err);
        this.errorMessage = err?.error?.message;
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  closeModal(): void {
    this.serviceForm.reset(); // Reset form when closing
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
