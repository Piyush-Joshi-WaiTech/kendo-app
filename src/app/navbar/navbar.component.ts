import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Input() activeTab: string = '';

  tabs = [
    { label: 'DASHBOARD', icon: 'bi-grid' },
    { label: 'AGENT MANAGEMENT', icon: 'bi-person-badge' },
    { label: 'CALENDAR', icon: 'bi-calendar' },
    { label: 'EZ QUOTE', icon: 'bi-file-earmark-text' },
    { label: 'LEAD MANAGEMENT', icon: 'bi-diagram-3' },
    { label: 'ACTIVITIES', icon: 'bi-list-check' },
    { label: 'WORKFLOWS', icon: 'bi-recycle' },
    { label: 'CHAT', icon: 'bi-chat-dots', badge: 1 },
  ];

  isNightMode: boolean = false;

  toggleNightMode(): void {
    this.isNightMode = !this.isNightMode;
    const body = document.body;

    if (this.isNightMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }
}
