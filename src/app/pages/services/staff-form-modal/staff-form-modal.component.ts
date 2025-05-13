import { Component, EventEmitter, Input, Output, inject, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { ApiserviceService } from '../../../services/apiservice/apiservice.service';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Staff } from '../../../models/staff/staff';
import { CommonModule } from '@angular/common';

// Add these interfaces at the top of the file
interface TimeRange {
    day: string;
    start: string;
    end: string;
}

interface BlockTimeRange {
    date: string;
    start: string;
    end: string;
}

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
    timeRanges: TimeRange[] = [];
    showTimePicker = false;
    newStartTime = '';
    newEndTime = '';
    selectedLanguage: any = null;
    selectedExpertise: any = null;
    selectedMultipleExpertise: any[] = [];
    expertise: any[] = [];
    languages: any[] = [];
    services: any[] = [];

    blockTimeRanges: BlockTimeRange[] = [];
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
        this.getAllServices();
        this.initializeForm(); // Initialize with empty form
    }

    initializeForm() {
        this.staffForm.reset();
        this.timeRanges = [];
        this.blockTimeRanges = [];
        
        // Reset form arrays
        while (this.allocated_services.length) {
            this.allocated_services.removeAt(0);
        }
        this.allocated_services.push(this.createServiceGroup());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['show']) {
            if (this.show) {
                if (!this.staffDataid) {
                    // New form
                    this.initializeForm();
                } else {
                    // Edit form
                    this.timeRanges = [];
                    this.blockTimeRanges = [];
                    
                    // Map working hours
                    this.timeRanges = this.staffDataid.working_hours.map((wh: any) => ({
                        day: wh.day.charAt(0).toUpperCase() + wh.day.slice(1),
                        start: wh.start_time.substring(0, 5),
                        end: wh.end_time.substring(0, 5)
                    }));

                    // Map block times
                    this.blockTimeRanges = this.staffDataid.block_times.map((bt: any) => ({
                        date: bt.date,
                        start: bt.start_time.substring(0, 5),
                        end: bt.end_time.substring(0, 5)
                    }));

                    // Handle allocated services
                    while (this.allocated_services.length) {
                        this.allocated_services.removeAt(0);
                    }

                    this.staffDataid.allocated_services.forEach((service: any) => {
                        this.allocated_services.push(this.fb.group({
                            service: [service.service_id],
                            duration_minutes: [service.duration_minutes],
                            price: [service.price]
                        }));
                    });

                    // Patch form values
                    this.staffForm.patchValue({
                        name: this.staffDataid.name,
                        email: this.staffDataid.email,
                        workingHours: this.timeRanges,
                        max_appointments_per_day: this.staffDataid.max_appointments_per_day,
                        phoneNumber: this.staffDataid.phone_number,
                        bio: this.staffDataid.bio,
                        blockTimes: this.blockTimeRanges,
                        language: this.staffDataid.language,
                        expertise: this.staffDataid.expertise
                    });
                }
            }
        }
    }

    getAllServices() {
        const url = `${this.baseUrl}/api/v1/business/5/services`;
        this.apiService.get(url).subscribe({
            next: (resp) => {
                this.services = resp.data;
            },
            error: (err) => {
                console.error('Error fetching services:', err);
            }
        });
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
        this.initializeForm(); // Reset form when closing
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
            date: bt.date,
            start_time: bt.start,
            end_time: bt.end
        }));

        const allocatedServices = formValue.allocated_services.map((service: any) => ({
            service: Number(service.service),
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
            max_appointments_per_day: Number(formValue.max_appointments_per_day),
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

        if (this.currentField === 'workingHours') {
            const range: TimeRange = {
                day: this.selectedDay,
                start: this.newStartTime,
                end: this.newEndTime
            };
            this.timeRanges.push(range);
            this.staffForm.get('workingHours')?.setValue(this.timeRanges);
        } else {
            const range: BlockTimeRange = {
                date: this.selectedDay, // Selected day will be a date for block times
                start: this.newStartTime,
                end: this.newEndTime
            };
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

