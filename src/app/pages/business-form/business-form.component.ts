import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-business-form',
  imports: [CommonModule],
  templateUrl: './business-form.component.html',
  styleUrl: './business-form.component.css',
  standalone: true,
})
export class BusinessFormComponent {
  @Output() modalClosed = new EventEmitter<void>();
  @Output() show = new EventEmitter<any>();

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.modalClosed.emit();
    document.body.style.overflow = '';
  }
}
