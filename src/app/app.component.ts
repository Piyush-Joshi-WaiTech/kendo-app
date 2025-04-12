import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import {
  GridModule,
  ScrollMode,
  PagerSettings,
} from '@progress/kendo-angular-grid';
import { NavbarComponent } from './navbar/navbar.component';
import { LeadManagementComponent } from './lead-management/lead-management.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    DropDownsModule,
    GridModule,
    NavbarComponent,
    LeadManagementComponent,
  ],
})
export class AppComponent {
  title = 'angular-standalone-navbar';
  activeTab = 'LEAD MANAGEMENT';

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
}
