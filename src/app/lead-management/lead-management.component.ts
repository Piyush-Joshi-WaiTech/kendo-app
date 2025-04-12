import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For ngModel
import { DropDownsModule } from '@progress/kendo-angular-dropdowns'; // For Kendo dropdowns

@Component({
  selector: 'app-lead-management',
  standalone: true,
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.css'],
  imports: [CommonModule, FormsModule, DropDownsModule],
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

  // Search keyword
  searchKeyword = '';

  activeToggle: string = 'Non-Intl'; // Default active toggle

  setActiveToggle(option: string): void {
    this.activeToggle = option;
  }
}
