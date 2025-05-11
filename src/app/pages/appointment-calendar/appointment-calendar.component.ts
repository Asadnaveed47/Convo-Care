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
    selectedAppointment: any = null;


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
        events: [],
        eventClick: (info) => {
            const appointmentId = parseInt(info.event.id, 10);
            this.selectedAppointment = this.listData.find(appt => appt.id === appointmentId);
            this.showModal = true;
          }
          
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
      
            // Convert to FullCalendar events
            const events = this.listData.map((appointment: any) => ({
                id: appointment.id.toString(),
                title: `${appointment.service_name} - ${appointment.staff_name}`,
                start: appointment.start_time,
                end: appointment.end_time,
                className: this.getStatusClass(appointment.appointment_status), // <-- add this
                extendedProps: {
                  notes: appointment.notes,
                  appointment_status: appointment.appointment_status,
                  business_name: appointment.business_name
                }
              }));
              
      
            this.calendarOptions.events = events;
          }
        });
      }
      getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
          case 'confirmed':
            return 'event-confirmed';
          case 'cancelled':
            return 'event-cancelled';
          case 'pending':
            return 'event-pending';
          default:
            return 'event-default';
        }
      }
      
      
      addBooking() {
          this.showModal = true;
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


    closeModal() {
        this.showModal = false;
    }

 
}
