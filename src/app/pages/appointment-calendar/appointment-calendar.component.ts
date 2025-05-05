import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core/index.js';

@Component({
    // imports: [CommonModule, FormsModule],
    imports: [CommonModule, FormsModule, FullCalendarModule],
    templateUrl: './appointment-calendar.component.html',
    styleUrl: './appointment-calendar.component.css'
})
export class AppointmentCalendarComponent {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridDay',
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
            { title: 'Launch', start: '2025-05-06T10:30:00' }
        ]
    };



    private calendarApi: any;
    currentDateTime: string = '';

    ngOnInit() {
        this.updateCurrentDateTime();
        setInterval(() => this.updateCurrentDateTime(), 60000); // Update every minute
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
        this.calendarApi?.changeView(view);
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
}
