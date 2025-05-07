import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-form-modal',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
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

  categories = [
    { id: 1, name: 'Surgery' },
    { id: 2, name: 'Consultation' }
  ];

  selectedCategory: any = null;
  selectedCategories: any[] = [];
}
