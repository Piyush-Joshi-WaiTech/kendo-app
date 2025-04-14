import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-lead-management',
  standalone: true,
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.css'],
  imports: [CommonModule, FormsModule, DropDownsModule, GridModule],
})
export class LeadManagementComponent {
  allLeadsOptions = [
    { text: 'Lead 1', value: 'Lead 1' },
    { text: 'Lead 2', value: 'Lead 2' },
    { text: 'Lead 3', value: 'Lead 3' },
  ];

  savedPreferencesOptions = [
    { text: 'Preference 1', value: 'Preference 1' },
    { text: 'Preference 2', value: 'Preference 2' },
    { text: 'Preference 3', value: 'Preference 3' },
  ];

  defaultLead = { text: 'All Leads', value: null };
  defaultPreference = { text: 'Select Saved Preference', value: null };

  selectedLead = this.defaultLead;
  selectedPreference = this.defaultPreference;

  searchKeyword = '';

  activeToggle: string = 'Non-Intl';

  setActiveToggle(option: string): void {
    this.activeToggle = option;
  }

  gridData = [
    {
      actions: 'Actions',
      recordId: 111994,
      lastName: 'TEST',
      firstName: 'APRILLELEVEN',
      email: 'TULSI.KULKARNI@WAIIN.COM',
      phoneType: 'Home (565) 656-5666-6',
      leadId: 2222000,
      appointmentType: '',
      bookingAgency: 2222000,
      status: 'Active',
      priority: 'High',
      createdDate: '2023-01-01',
      updatedDate: '2023-01-15',
      assignedTo: 'John Doe',
      department: 'Sales',
      region: 'North',
      comments: 'No comments',
    },
    {
      actions: 'Actions',
      recordId: 109907,
      lastName: 'Nat Storage',
      firstName: 'Marie',
      email: 'm@e.com',
      phoneType: 'Home (630) 555-2024',
      leadId: 2007000,
      appointmentType: '',
      bookingAgency: 2007000,
      status: 'Inactive',
      priority: 'Medium',
      createdDate: '2023-02-01',
      updatedDate: '2023-02-10',
      assignedTo: 'Jane Smith',
      department: 'Support',
      region: 'South',
      comments: 'Follow-up required',
    },
    {
      actions: 'Actions',
      recordId: 111962,
      lastName: 'Pathak 09-04',
      firstName: 'Pooja',
      email: 'p.u@gmail.com',
      phoneType: 'Home (313) 233-3233',
      leadId: 2222000,
      appointmentType: 'MS-Pro',
      bookingAgency: 2222000,
      status: 'Active',
      priority: 'Low',
      createdDate: '2023-03-01',
      updatedDate: '2023-03-05',
      assignedTo: 'Alice Johnson',
      department: 'Marketing',
      region: 'East',
      comments: 'Pending approval',
    },

    ...Array(12).fill({
      actions: 'Actions',
      recordId: 111999,
      lastName: 'Sample',
      firstName: 'User',
      email: 'sample.user@example.com',
      phoneType: 'Mobile (123) 456-7890',
      leadId: 123456,
      appointmentType: 'Standard',
      bookingAgency: 123456,
      status: 'Active',
      priority: 'High',
      createdDate: '2023-04-01',
      updatedDate: '2023-04-10',
      assignedTo: 'Default User',
      department: 'IT',
      region: 'West',
      comments: 'No comments',
    }),
  ];
}
