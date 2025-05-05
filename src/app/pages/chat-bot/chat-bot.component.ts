import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class ChatBotComponent {
  @ViewChild('modal') modal!: ElementRef;

  isModalOpen = false;

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
