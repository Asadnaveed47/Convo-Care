import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatBotComponent } from '../../pages/chat-bot/chat-bot.component';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, CommonModule, ChatBotComponent],
})
export class MainDashboardComponent {

}
