import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  // imports: [CommonModule, FormsModule],
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-calendar.component.html',
  styleUrl: './appointment-calendar.component.css'
})
export class AppointmentCalendarComponent {
  selectedDate = new Date();

  timeSlots = [
    '9:00 am', '10:00 am', '11:00 am', '12:00 pm',
    '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm'
  ];

  staff = [
    {
      name: 'John Peter',
      role: 'Dentist',
      avatar: 'assets/profile-pic.png',
      onLeave: false,
      bookings: [
        { name: 'Kelly Maria', start: 11, end: 12, status: 'Pending' },
        { name: 'James Boland', start: 13, end: 13.5, status: 'Pending' }
      ]
    },
    {
      name: 'Khawaja',
      role: 'Sargon',
      avatar: 'assets/profile-pic.png',
      onLeave: true,
      bookings: []
    },
    // Add other staff here...
  ];

  getSlotTopPercent(start: number): number {
    return ((start - 9) / (17 - 9)) * 100;
  }

  getSlotHeightPercent(start: number, end: number): number {
    return ((end - start) / (17 - 9)) * 100;
  }
}
