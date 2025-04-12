import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GridModule,
  ScrollMode,
  PagerSettings,
} from '@progress/kendo-angular-grid';
import { NavbarComponent } from './navbar/navbar.component';
import { LeadManagementComponent } from './lead-management/lead-management.component'; // Import the component

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, GridModule, NavbarComponent, LeadManagementComponent],
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

  // ✅ Grid configuration
  // gridData = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     age: 32,
  //     department: 'Sales',
  //     email: 'john@example.com',
  //     status: 'active',
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Smith',
  //     age: 28,
  //     department: 'Marketing',
  //     email: 'jane@example.com',
  //     status: 'inactive',
  //   },
  //   {
  //     id: 3,
  //     name: 'Mike Johnson',
  //     age: 45,
  //     department: 'HR',
  //     email: 'mike@example.com',
  //     status: 'active',
  //   },
  // ];

  // gridHeight = 500;
  // gridResizable = true;
  // gridSortable = true;
  // gridFilterable = true;
  // gridGroupable = true;
  // gridScrollable: ScrollMode = 'scrollable';

  // gridPageable: PagerSettings = {
  //   buttonCount: 5,
  //   info: true,
  //   type: 'numeric',
  //   pageSizes: true,
  //   previousNext: true,
  // };

  // // ✅ Action method
  // deleteRow(item: any): void {
  //   this.gridData = this.gridData.filter((row) => row !== item);
  // }
}
