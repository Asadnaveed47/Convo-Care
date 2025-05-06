import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-form-modal',
  imports: [CommonModule],
  templateUrl: './staff-form-modal.component.html',
  styleUrl: './staff-form-modal.component.css'
})
export class StaffFormModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
