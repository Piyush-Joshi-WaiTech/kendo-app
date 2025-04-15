import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LEAD_DATA } from './lead-data';
import {
  GridModule,
  GridDataResult,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  ExcelExportComponent,
  ExcelExportModule,
} from '@progress/kendo-angular-excel-export';
import {
  ExcelExportData,
  WorkbookOptions,
} from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-lead-management',
  standalone: true,
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    DropDownsModule,
    GridModule,
    ExcelExportModule,
  ],
})
export class LeadManagementComponent {
  @ViewChild('excelExport', { static: false })
  excelExport!: ExcelExportComponent;

  public exportToExcel(): void {
    this.excelExport.save();
  }

  allSelected: boolean = false;

  toggleSelectAll(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.allSelected = input.checked;

    const data = (this.gridData as GridDataResult).data;

    if (this.allSelected) {
      data.forEach((item: any) => this.selectedRows.add(item.recordId));
    } else {
      this.selectedRows.clear();
    }
  }

  allSyncSelected: boolean = false; // Track the "Select All" checkbox state for Sync to Mobile

  // Toggle "Select All" for Sync to Mobile
  toggleSyncSelectAll(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.allSyncSelected = input.checked;

    const data = (this.gridData as GridDataResult).data;

    data.forEach((item: any) => (item.syncToMobile = this.allSyncSelected));
  }

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

  private allData = LEAD_DATA;

  public gridData: GridDataResult = {
    data: this.allData.slice(0, 10),
    total: this.allData.length,
  };

  public pageSize = 10;
  public skip = 0;

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.updateGridData();
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
      recordId: null,
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

    const gridCopy = [...this.gridData.data];
    gridCopy.unshift(newRecord);
    this.gridData = {
      data: gridCopy,
      total: this.allData.length,
    };

    this.editingRowIndex = 0;
    this.originalDataItem = JSON.parse(JSON.stringify(newRecord));
  }

  public editRecord(dataItem: any): void {
    const recordIndex = this.allData.findIndex(
      (item) => item.recordId === dataItem.recordId
    );
    if (recordIndex !== -1) {
      const updatedRecord = { ...dataItem, lastName: 'Updated Last Name' };
      this.allData[recordIndex] = updatedRecord;
      this.updateGridData();
    }
  }

  public addRow(): void {
    this.addRecord();
  }

  editingRowIndex: number | null = null;
  originalDataItem: any = null;

  editRow(rowIndex: number): void {
    this.editingRowIndex = rowIndex;
    const editingItem = this.gridData.data[rowIndex];
    this.originalDataItem = JSON.parse(JSON.stringify(editingItem));
  }

  cancelEdit(): void {
    if (this.editingRowIndex !== null) {
      const tempRow = this.gridData.data[this.editingRowIndex];

      if (!tempRow.recordId) {
        const gridCopy = [...this.gridData.data];
        gridCopy.splice(this.editingRowIndex, 1);
        this.gridData = {
          data: gridCopy,
          total: this.allData.length,
        };
      } else if (this.originalDataItem) {
        this.gridData.data[this.editingRowIndex] = { ...this.originalDataItem };
      }
    }

    this.editingRowIndex = null;
    this.originalDataItem = null;
  }

  updateRow(rowIndex: number): void {
    const updatedItem = this.gridData.data[rowIndex];

    if (!updatedItem.recordId) {
      updatedItem.recordId = this.allData.length + 1;
      this.allData.unshift(updatedItem);
    } else {
      const globalIndex = this.skip + rowIndex;
      this.allData[globalIndex] = { ...updatedItem };
    }

    this.updateGridData();
    this.editingRowIndex = null;
    this.originalDataItem = null;
  }

  private updateGridData(): void {
    this.gridData = {
      data: this.allData.slice(this.skip, this.skip + this.pageSize),
      total: this.allData.length,
    };
  }
}
