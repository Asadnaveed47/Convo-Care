import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-form-modal',
  imports: [CommonModule],
  templateUrl: './service-form-modal.component.html',
  styleUrl: './service-form-modal.component.css'
})
export class ServiceFormModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  status: 'active' | 'inactive' = 'active';
}
