import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-staff-form',
  imports: [CommonModule],
  templateUrl: './staff-form.component.html',
  styleUrl: './staff-form.component.css'
})
export class StaffFormComponent {
  @Output() modalClosed = new EventEmitter<void>();
  @Output() staffAdded = new EventEmitter<any>();

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.modalClosed.emit();
    document.body.style.overflow = '';
  }

  onSubmit() {
    // Here you would typically handle form submission
    // For now, we'll just emit an event and close the modal
    const newStaff = {
      // Get values from form inputs
    };
    this.staffAdded.emit(newStaff);
    this.closeModal();
  }
}
