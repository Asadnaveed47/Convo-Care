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
    imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule],
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

    blockTimeRanges: { start: string; end: string }[] = [];
    currentField: 'workingHours' | 'blockTimes' = 'workingHours';
    daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    selectedDay: string = '';

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
        });
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
            });
        }
    }

    createServiceGroup(): FormGroup {
        return this.fb.group({
            service: [''],
            duration_minutes: [''],
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
                console.error('Error creating staff:', err);
            }
        });
    }

    updateStaff(url: string, payload: Staff): void {
        this.apiService.edit(url, payload).subscribe({
            next: (resp) => {
                console.log('Staff updated:', resp);
                this.staffForm.reset();
                this.closeModal();
            },
            error: (err) => {
                console.error('Error updating staff:', err);
            }
        });
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
        console.log("formValue.blockTimes", formValue.blockTimes);
        console.log("workingHours", formValue.workingHours);

        const workingHours = formValue.workingHours.map((wh: any) => ({
            day: wh.day.toLowerCase(),
            start_time: wh.start,
            end_time: wh.end
        }));

        const blockTimes = formValue.blockTimes.map((bt: any) => ({
            date: bt.date,
            start_time: bt.start,
            end_time: bt.end,
            reason: bt.reason
        }));

        const allocatedServices = formValue.allocated_services.map((service: any) => ({
            id: service.id,
            service_id: service.service_id,
            service_name: service.service_name,
            service_description: service.service_description,
            price: service.price,
            duration_minutes: service.duration_minutes
        }));

        const payload: any = {
            name: formValue.name,
            email: formValue.email,
            phone_number: formValue.phoneNumber,
            bio: formValue.bio,
            working_hours: workingHours,
            holidays: formValue.holidays,
            block_times: blockTimes,
            max_appointments_per_day: formValue.max_appointments_per_day,
            allocated_services: allocatedServices
        };

        console.log(payload);

        if (this.staffToEdit?.id) {
            const url = `${this.baseUrl}/api/v1/business/5/staff/${this.staffToEdit.id}`;
            this.updateStaff(url, payload);
        } else {
            const url = `${this.baseUrl}/api/v1/business/5/staff`;
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

    openTimeRangePicker(field: 'workingHours' | 'blockTimes') {
        this.currentField = field;
        this.selectedDay = '';
        this.newStartTime = '';
        this.newEndTime = '';
        this.showTimePicker = true;
    }

    addTimeRange() {
        if (!this.selectedDay || !this.newStartTime || !this.newEndTime) return;

        const range = { day: this.selectedDay, start: this.newStartTime, end: this.newEndTime };

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

