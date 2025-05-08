import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-business-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './business-form.component.html',
  styleUrl: './business-form.component.css',
  standalone: true,
})
export class BusinessFormComponent {
  @Output() modalClosed = new EventEmitter<void>();
  @Output() show = new EventEmitter<any>();

  businessForm: FormGroup;
  currenciesList: any[] = [];
  workHours: any[] = [];
  BusinessData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', Validators.required],
      currency: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      workingHours: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required]
    });

     this.currenciesList = [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
      { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
      { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
      { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
      { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
      { code: 'PAK', name: 'Rupess', symbol: 'RS' }
    ];
    this.workHours = [
      { id: '1', name: '1 Hour' },
      { id: '2', name: '2 Hours' },
      { id: '3', name: '3 Hours' },
      { id: 'JPY', name: '4 Hours' },
      { id: 'CNY', name: '5 Hours' },
      { id: 'CAD', name: '6 Hours' },
      { id: 'SGD', name: '7 Hours' },
      { id: 'AED', name: '8 Hours' },
      { id: 'HKD', name: '9 Hours' },
      { id: 'RUB', name: '10 Hours' },
      { id: 'PAK', name: '11 Hours',}
    ];
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.getBusinessData();
  }
  onSubmit(): void {
    if (this.businessForm.valid) {
      console.log('Form submitted:', this.businessForm.value);
      this.closeModal();
    } else {
      this.markFormGroupTouched(this.businessForm);
    }
  }

  getBusinessData() {
    let url = new URL(`${environment.baseUrl}/api/v1/businesses`);
    // for (let key in filters) {
    //   if (!!filters[key]) {
    //     url.searchParams.set(key, filters[key]);
    //   }
    // }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.BusinessData = resp.data;
     

    }, (err: any) => {
    
    });
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  get name() { return this.businessForm.get('name'); }
  get businessType() { return this.businessForm.get('businessType'); }
  get currency() { return this.businessForm.get('currency'); }
  get phone() { return this.businessForm.get('phone'); }
  get workingHours() { return this.businessForm.get('workingHours'); }
  get email() { return this.businessForm.get('email'); }
  get location() { return this.businessForm.get('location'); }

  closeModal() {
    this.modalClosed.emit();
    document.body.style.overflow = '';
  }
}
