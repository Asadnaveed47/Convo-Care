import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-booking-form',
  imports: [],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
  standalone: true,
})
export class BookingFormComponent {
  @Output() modalClosed = new EventEmitter<void>();
  @Output() bookingAdded = new EventEmitter<any>();

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.modalClosed.emit();
    document.body.style.overflow = '';
  }
}
