// models/appointment.model.ts
export interface Appointment {
    id: number;
    doctorId: number;
    patientName: string;
    date: string; // ISO format
    timeSlot: string; // e.g. "10:00 AM - 10:30 AM"
  }
  