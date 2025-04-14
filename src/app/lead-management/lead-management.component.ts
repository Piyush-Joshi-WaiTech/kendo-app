import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LEAD_DATA } from './lead-data';
import {
  GridModule,
  GridDataResult,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';

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

  selectedLeadValue: string | null = this.defaultLead.value;
  selectedPreferenceValue: string | null = this.defaultPreference.value;

  searchKeyword = '';

  activeToggle: string = 'Non-Intl';

  setActiveToggle(option: string): void {
    this.activeToggle = option;
  }

  private allData = LEAD_DATA; //All data stored on file lead-data.ts

  public gridData: GridDataResult = {
    data: this.allData.slice(0, 10),
    total: this.allData.length,
  };

  public pageSize = 10;
  public skip = 0;

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.gridData = {
      data: this.allData.slice(this.skip, this.skip + this.pageSize),
      total: this.allData.length,
    };
  }

  public selectedRows: Set<number> = new Set<number>();

  public onRowSelectChange(dataItem: any): void {
    if (this.selectedRows.has(dataItem.recordId)) {
      this.selectedRows.delete(dataItem.recordId);
    } else {
      this.selectedRows.add(dataItem.recordId);
    }
  }

  public rowClass = (context: { dataItem: any; index: number }): string => {
    return this.selectedRows.has(context.dataItem.recordId)
      ? 'selected-row'
      : '';
  };

  public deletePreference(preference: any): void {
    this.savedPreferencesOptions = this.savedPreferencesOptions.filter(
      (item) => item.value !== preference.value
    );
  }

  public addRecord(): void {
    const newRecord = {
      recordId: this.allData.length + 1,
      lastName: '',
      firstName: '',
      email: '',
      phoneType: '',
      leadId: '',
      appointmentType: '',
      bookingAgency: '',
      status: '',
      priority: '',
      createdDate: new Date(),
      updatedDate: new Date(),
      assignedTo: '',
      department: '',
      region: '',
      comments: '',
    };

    this.allData.unshift(newRecord);
    this.updateGridData();
  }

  public editRecord(dataItem: any): void {
    const recordIndex = this.allData.findIndex(
      (item) => item.recordId === dataItem.recordId
    );
    if (recordIndex !== -1) {
      const updatedRecord = { ...dataItem, lastName: 'Updated Last Name' }; // Example update
      this.allData[recordIndex] = updatedRecord;
      this.updateGridData();
    }
  }

  public addRow(): void {
    const newRecord = {
      recordId: this.allData.length + 1,
      lastName: '',
      firstName: '',
      email: '',
      phoneType: '',
      leadId: '',
      appointmentType: '',
      bookingAgency: '',
      status: '',
      priority: '',
      createdDate: new Date(),
      updatedDate: new Date(),
      assignedTo: '',
      department: '',
      region: '',
      comments: '',
    };

    this.allData.unshift(newRecord);
    this.updateGridData();
  }

  // Edit an existing row
  public editRow(rowIndex: number): void {
    this.editingRowIndex = rowIndex;
  }

  public updateRow(rowIndex: number): void {
    this.editingRowIndex = null;
    this.updateGridData();
  }

  public cancelEdit(): void {
    this.editingRowIndex = null;
  }

  private updateGridData(): void {
    this.gridData = {
      data: this.allData.slice(this.skip, this.skip + this.pageSize),
      total: this.allData.length,
    };
  }

  public editingRowIndex: number | null = null;
  public newRow: any = {};
}
