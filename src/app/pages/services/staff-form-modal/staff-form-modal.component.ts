import { Component, EventEmitter, Input, Output, inject, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { ApiserviceService } from '../../../services/apiservice/apiservice.service';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Staff } from '../../../models/staff/staff';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-staff-form-modal',
    imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule],
    templateUrl: './staff-form-modal.component.html',
    styleUrl: './staff-form-modal.component.css'
})
export class StaffFormModalComponent implements OnInit {
    private apiService = inject(ApiserviceService);
    private baseUrl = environment.baseUrl;

    @Input() show = false;
    @Output() close = new EventEmitter<void>();
    @Input() staffDataid?: any;

    staffForm!: FormGroup;
    timeRanges: { start: string, end: string }[] = [];
    showTimePicker = false;
    newStartTime = '';
    newEndTime = '';
    selectedLanguage: any = null;
    selectedExpertise: any = null;
    selectedMultipleExpertise: any[] = [];
    expertise: any[] = [];
    languages: any[] = [];
    services: any[] = [];

    blockTimeRanges: { start: string; end: string }[] = [];
    currentField: 'workingHours' | 'blockTimes' = 'workingHours';
    daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    selectedDay: string = '';

    errorMessage: string = '';

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
            blockTimes: [[], [Validators.required]],
            allocated_services: this.fb.array([this.createServiceGroup()])
        });

        this.expertise = [
            { id: 1, name: 'X-ray' },
            { id: 2, name: 'Consultation' }
        ];

        this.languages = [
            { id: 1, name: 'English' },
            { id: 2, name: 'Urdu' },
            { id: 3, name: 'Spanish' },
        ];

        this.services = [
            { id: 1, name: 'Generic Consultation' },
            { id: 2, name: 'Daily Consultation' },
            { id: 3, name: 'Generic Consultation' }
        ];

    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['staffDataid'] && this.staffDataid) {
            this.staffForm.patchValue({
                name: this.staffDataid.name,
                email: this.staffDataid.email,
                workingHours: this.staffDataid.workingHours,
                max_appointments_per_day: this.staffDataid.max_appointments_per_day,
                language: this.staffDataid.language,
                phoneNumber: this.staffDataid.phoneNumber,
                expertise: this.staffDataid.expertise,
                bio: this.staffDataid.bio,
                blockTimes: this.staffDataid.block_times,
                allocated_services: this.staffDataid.allocated_services
            });
        }
    }


    createServiceGroup(): FormGroup {
        return this.fb.group({
            service: ['', [Validators.required]],
            duration_minutes: ['', [Validators.required]],
            price: ['', [Validators.required]]
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
                this.staffForm.reset();
                this.closeModal();
            },
            error: (err) => {
                console.error('Create staff error:', err.error || err);
            }
        });
    }

    updateStaff(url: string, payload: Staff): void {
        this.apiService.edit(url, payload).subscribe({
            next: (resp) => {
                this.staffForm.reset();
                this.closeModal();
            },
            error: (err) => {
            }
        });
    }

    closeModal(): void {
        this.close.emit();
    }

    onSubmit() {
        console.log("Form values:", this.staffForm.value);
        if (!this.staffForm.valid) {
            this.markFormGroupTouched(this.staffForm);
            return;
        }

        const formValue = this.staffForm.value;

        const workingHours = formValue.workingHours.map((wh: any) => ({
            day: wh.day.toLowerCase(),
            start_time: wh.start,
            end_time: wh.end
        }));

        const blockTimes = formValue.blockTimes.map((bt: any) => ({
            date: bt.day,
            start_time: bt.start,
            end_time: bt.end
        }));

        const allocatedServices = formValue.allocated_services.map((service: any) => ({
            service: service.service,
            price: service.price,
            duration_minutes: service.duration_minutes
        }));

        const payload: any = {
            full_name: formValue.name,
            name: formValue.name,
            email: formValue.email,
            phone_number: formValue.phoneNumber,
            bio: formValue.bio,
            working_hours: workingHours,
            holidays: formValue.holidays ?? [],
            block_times: blockTimes,
            max_appointments_per_day: formValue.max_appointments_per_day,
            allocated_services: allocatedServices,
            language: formValue.language,
            expertise: formValue.expertise
        };

        if (this.staffDataid?.id) {
            const url = `${this.baseUrl}/api/v1/business/5/staff/${this.staffDataid.id}`;
            this.updateStaff(url, payload);
        } else {
            console.log(payload);
            const url = `${this.baseUrl}/api/v1/business/5/staff`;
            this.createStaff(url, payload);
        }
    }

    markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
        });
    }

    openTimeRangePicker(field: 'workingHours' | 'blockTimes') {
        this.currentField = field;
        this.selectedDay = '';
        this.newStartTime = '';
        this.newEndTime = '';
        this.showTimePicker = true;
    }

    addTimeRange() {
        if (!this.selectedDay || !this.newStartTime || !this.newEndTime) return;

        const range = {
            day: this.selectedDay,
            start: this.newStartTime,
            end: this.newEndTime
        };

        if (this.currentField === 'workingHours') {
            this.timeRanges.push(range);
            this.staffForm.get('workingHours')?.setValue(this.timeRanges);
        } else {
            this.blockTimeRanges.push(range);
            this.staffForm.get('blockTimes')?.setValue(this.blockTimeRanges);
        }

        this.closeTimePicker();
    }

    removeRange(index: number, field: 'workingHours' | 'blockTimes') {
        if (field === 'workingHours') {
            this.timeRanges.splice(index, 1);
            this.staffForm.get('workingHours')?.setValue(this.timeRanges);
        } else {
            this.blockTimeRanges.splice(index, 1);
            this.staffForm.get('blockTimes')?.setValue(this.blockTimeRanges);
        }
    }

    closeTimePicker() {
        this.showTimePicker = false;
    }

    updateWorkingHoursForm() {
        const timeStrings = this.timeRanges.map(r => `${r.start} - ${r.end}`);
        this.staffForm.get('workingHours')?.setValue(timeStrings.join(', '));
    }
}

