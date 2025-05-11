import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { BookingFormComponent } from "../dashboard/booking-form/booking-form.component";
import { environment } from '../../../environments/environment';
import { ApiserviceService } from '../../services/apiservice/apiservice.service';

@Component({
    // imports: [CommonModule, FormsModule],
    imports: [CommonModule, FormsModule, FullCalendarModule, BookingFormComponent],
    templateUrl: './appointment-calendar.component.html',
    styleUrl: './appointment-calendar.component.css'
})
export class AppointmentCalendarComponent {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' = 'dayGridMonth';

    private calendarApi: any;
    currentDateTime: string = '';
    showModal = false;
    activeTab: 'calendar' | 'list' = 'calendar';
    private apiService = inject(ApiserviceService);
    private baseUrl = environment.baseUrl;
    listData: any[] = [];


    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: false,
        allDaySlot: false,
        editable: true,
        selectable: true,
        nowIndicator: true,
        slotMinTime: '00:00:00',
        slotMaxTime: '24:00:00',
        slotDuration: '00:30:00',
        events: [
            { title: 'Meeting', start: '2025-05-05T16:00:00' },
            { title: 'Launch', start: '2025-05-06T10:30:00' },
            { title: 'Conference', start: '2025-05-06T10:30:00' },
            { title: 'Workshop', start: '2025-05-08T14:00:00' },
            { title: 'Webinar', start: '2025-05-09T09:00:00' },
            { title: 'Networking', start: '2025-05-06T10:30:00' },
            { title: 'Team Building', start: '2025-05-11T13:00:00' },
            { title: 'Training', start: '2025-05-12T15:00:00' },
            { title: 'Seminar', start: '2025-05-13T17:00:00' },
        ]
    };

    ngOnInit() {
        this.getAllAppointments();
        this.updateCurrentDateTime();
        setInterval(() => this.updateCurrentDateTime(), 60000); // Update every minute
    }

    getAllAppointments() {
        const url = `${this.baseUrl}/api/v1/business/5/appointments`;
        this.apiService.get(url).subscribe(response => {
          if (response.status === 1000) {
            this.listData = response.data;
          }
        });
      }

    ngAfterViewInit() {
        this.calendarApi = this.calendarComponent.getApi();
    }

    updateCurrentDateTime() {
        const now = new Date();
        this.currentDateTime = now.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') {
        console.log('Change view to:', view);
        this.currentView = view;
        this.calendarApi?.changeView(view);
        this.calendarApi = this.calendarComponent.getApi();
      }

    next() {
        this.calendarApi?.next();
    }

    prev() {
        this.calendarApi?.prev();
    }

    today() {
        this.calendarApi?.today();
    }

    addBooking() {
        this.showModal = true;
        console.log('Add Booking button clicked');

    }

    closeModal() {
        this.showModal = false;
    }

    handleBookingAdded(newStaff: any) {
        console.log('New Booking added:', newStaff);
    }
}
