import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { process, State, DataResult } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

import { LEAD_DATA } from './lead-data';

import {
  GridModule,
  GridDataResult,
  PageChangeEvent,
  GridComponent,
} from '@progress/kendo-angular-grid';
import {
  ExcelExportComponent,
  ExcelExportModule,
} from '@progress/kendo-angular-excel-export';
import {
  ExcelExportData,
  WorkbookOptions,
} from '@progress/kendo-angular-excel-export';
import { LeadManagementService } from './lead-management.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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
    HttpClientModule,
  ],
})
export class LeadManagementComponent implements OnInit, AfterViewInit {
  constructor(private leadService: LeadManagementService, private http: HttpClient) {}

  @ViewChild('excelExport', { static: false })
  excelExport!: ExcelExportComponent;

  @ViewChild('grid', { static: false }) grid!: GridComponent;

  preferences: any[] = []; // Store saved preferences

  columnsConfig = [
    { field: 'recordId', title: 'Record Id', width: 150 },
    { field: 'lastName', title: 'Last Name', width: 150 },
    { field: 'firstName', title: 'First Name', width: 150 },
    { field: 'email', title: 'Primary Email Address', width: 150 },
    { field: 'phoneType', title: 'Phone Type', width: 150 },
    // Add all other fields here
  ];

  displayedColumns = [...this.columnsConfig]; // Initial full list

  ngOnInit(): void {
    this.loadLeads();
    this.loadPreferences(); // Load preferences on initialization
  }

  ngAfterViewInit(): void {
    console.log('Grid is:', this.grid); // for the grid is loaded
  }

  loadLeads(): void {
    this.leadService.getLeads().subscribe((data: any[]) => {
      this.allData = data;
      this.updateGridData();
    });
  }

  public exportToExcel(): void {
    this.excelExport.save();
  }

  allSelected: boolean = false;

  toggleSelectAll(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.allSelected = input.checked;

    const data = (this.gridData as GridDataResult).data;

    if (this.allSelected) {
      data.forEach((item: any) => this.selectedRows.add(item.id));
    } else {
      this.selectedRows.clear();
    }
  }

  allSyncSelected: boolean = false;

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

  private _searchKeyword: string = ''; // Ensure this property exists

  get searchKeyword(): string {
    return this._searchKeyword;
  }

  set searchKeyword(value: string) {
    this._searchKeyword = value;
    this.filterGridData();
  }

  activeToggle: string = 'Non-Intl';

  setActiveToggle(option: string): void {
    this.activeToggle = option;
  }

  private allData: any[] = [];

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
    if (this.selectedRows.has(dataItem.id)) {
      this.selectedRows.delete(dataItem.id);
    } else {
      this.selectedRows.add(dataItem.id);
    }
  }

  public rowClass = (context: { dataItem: any; index: number }): string => {
    return this.selectedRows.has(context.dataItem.id) ? 'selected-row' : '';
  };

  public deletePreference(preference: any): void {
    this.leadService.deleteLead(preference.id).subscribe(() => {
      this.allData = this.allData.filter((item) => item.id !== preference.id);
      this.updateGridData();
    });
  }

  public addRecord(): void {
    const newRecord = {
      recordId: '',
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
      syncToMobile: false,
    }; // Removed duplicate properties

    // Add the new record to the grid data
    const gridCopy = [...this.gridData.data];
    gridCopy.unshift(newRecord);
    this.gridData = {
      data: gridCopy,
      total: this.allData.length + 1,
    };

    // Set the new record as the one being edited
    this.editingRowIndex = 0;
    this.originalDataItem = JSON.parse(JSON.stringify(newRecord));

    // Enable editing for all fields of the new record
    this.editingField = { rowIndex: 0, field: null }; // Set field to null to indicate all fields are editable in create mode

    // Add a flag to indicate new record creation mode
    this.isCreatingNewRecord = true;
  }

  newRowIds: Set<number> = new Set();

  addRow(): void {
    const newRecord = {
      recordId: this.generateId(),
      lastName: '',
      firstName: '',
      email: '',
      phoneType: '',
      leadId: '',
      appointmentType: '',
      bookingAgency: '',
      status: '',
      priority: '',
      createdDate: '',
      updatedDate: '',
      assignedTo: '',
      department: '',
      region: '',
      comments: ''
    };

    console.log('Adding new record:', newRecord); // Debugging
    this.gridData.data.unshift(newRecord);
    this.newRowIds.add(newRecord.recordId);
    console.log('New row IDs:', this.newRowIds); // Debugging
    this.editingField = { rowIndex: 0, field: null }; // Enable editing for all fields in the new row
  }

  onCellBlur(record: any, field: string, event: any): void {
    // Only auto-save for existing records, not for new ones
    if (!record.id) {
      // New record: just update the local value,  not call updateRecord
      record[field] = event.target.value;
      return;
    }
    const newValue = event.target.value;
    if (record[field] !== newValue) {
      record[field] = newValue;
      this.updateRecord(record); // PATCH to JSON server
    }
  }

  saveNewRow(record: any): void {
    this.http.post('http://localhost:3000/leads', record).subscribe(() => {
      this.newRowIds.delete(record.recordId); // Treat as a normal row after saving
      this.isCreatingNewRecord = false;
      this.editingField = null;
      this.editingRowIndex = null;
    });
  }

  formatDate(date: any): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // // TEMPORARY ID GENERATOR
  private generateTempId(): number {
    const maxId = this.allData.length
      ? Math.max(...this.allData.map((d) => d.id || 0))
      : 0;
    return maxId + 1;
  }

  generateId(): number {
    return Date.now(); // Simple unique ID based on timestamp
  }

  updateRecord(record: any): void {
    this.http.patch(`http://localhost:3000/leads/${record.recordId}`, record).subscribe();
  }

  editingRowIndex: number | null = null;
  originalDataItem: any = null;

  editRow(rowIndex: number): void {
    this.editingRowIndex = rowIndex;
    const editingItem = this.gridData.data[rowIndex];
    if (editingItem) {
      this.originalDataItem = JSON.parse(JSON.stringify(editingItem));
    }
  }

  cancelEdit(): void {
    if (this.editingRowIndex !== null) {
      const tempRow = this.gridData.data[this.editingRowIndex];

      if (!tempRow.id && tempRow.id !== 0) {
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
    const updatedLead = this.gridData.data[rowIndex];

    if (!updatedLead.id) {
      // Create new
      this.leadService.addLead(updatedLead).subscribe((createdLead) => {
        this.allData[0] = createdLead;
        this.updateGridData();
        this.editingRowIndex = null;

        // SweetAlert success for adding a new lead
        Swal.fire({
          icon: 'success',
          title: 'Lead Added',
          text: 'The new lead has been successfully created!',
          timer: 2000,
          showConfirmButton: false,
        });
      });
    } else {
      // Update existing
      this.leadService.updateLead(updatedLead.id, updatedLead).subscribe(() => {
        const index = this.allData.findIndex(
          (item) => item.id === updatedLead.id
        );
        if (index !== -1) {
          this.allData[index] = updatedLead;
          this.updateGridData();
        }
        this.editingRowIndex = null;

        //  SweetAlert success for updating an existing lead
        Swal.fire({
          icon: 'success',
          title: 'Lead Updated',
          text: 'Changes have been saved successfully!',
          timer: 2000,
          showConfirmButton: false,
        });
      });
    }
  }

  public editRecord(dataItem: any): void {
    const recordIndex = this.allData.findIndex(
      (item) => item.id === dataItem.id
    );
    if (recordIndex !== -1) {
      this.editRow(recordIndex - this.skip); // account for pagination
    }
  }

  public deleteRecord(dataItem: any): void {
    console.log('Deleting record:', dataItem);

    if (dataItem.id === null || dataItem.id === undefined) {
      // Unsaved record, just remove from grid
      this.allData = this.allData.filter((item) => item !== dataItem);
      this.updateGridData();
      console.log('Removed unsaved item from grid only');
      return;
    }

    // SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this lead?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.leadService.deleteLead(dataItem.id).subscribe(
          () => {
            console.log(` Lead with ID ${dataItem.id} deleted from db.json`);
            this.allData = this.allData.filter(
              (item) => item.id !== dataItem.id
            );
            this.updateGridData();

            // Success alert
            Swal.fire('Deleted!', 'The lead has been deleted.', 'success');
          },
          (error) => {
            console.error(
              `❌ Failed to delete lead with ID ${dataItem.id}`,
              error
            );
            // Error alert
            Swal.fire(
              'Error',
              'Failed to delete the lead. Please try again.',
              'error'
            );
          }
        );
      }
    });
  }

  private updateGridData(): void {
    this.gridData = {
      data: this.allData.slice(this.skip, this.skip + this.pageSize),
      total: this.allData.length,
    };
  }

  filterGridData(): void {
    const keyword = this.searchKeyword.toLowerCase();

    // Filter the data based on the search keyword
    const filteredData = this.allData.filter((item) => {
      return (
        item.recordId?.toString().toLowerCase().includes(keyword) ||
        item.lastName?.toLowerCase().includes(keyword) ||
        item.firstName?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.phoneType?.toLowerCase().includes(keyword) ||
        item.leadId?.toString().toLowerCase().includes(keyword) ||
        item.appointmentType?.toLowerCase().includes(keyword) ||
        item.bookingAgency?.toString().toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword) ||
        item.priority?.toLowerCase().includes(keyword) ||
        item.assignedTo?.toLowerCase().includes(keyword) ||
        item.department?.toLowerCase().includes(keyword) ||
        item.region?.toLowerCase().includes(keyword) ||
        item.comments?.toLowerCase().includes(keyword)
      );
    });

    // Update the grid data with the filtered data
    this.gridData = {
      data: filteredData.slice(this.skip, this.skip + this.pageSize),
      total: filteredData.length,
    };
  }

  public gridState: State = {
    sort: [],
    skip: this.skip,
    take: this.pageSize,
  };

  public onDataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.skip = state.skip ?? 0;
    this.pageSize = state.take ?? 10;

    this.gridData = process(this.allData, this.gridState);
  }

  // Add a property to track the currently edited field
  public editingField: { rowIndex: number | null; field: string | null } | null = null;

  // Add a flag to track new record creation mode
  public isCreatingNewRecord: boolean = false;

  // Method to enable editing for a specific field
  public enableFieldEdit(rowIndex: number, field: string): void {
    if (this.isCreatingNewRecord && rowIndex === 0) {
      // Do not change editingField if creating a new record
      return;
    }
    this.editingField = { rowIndex, field };
  }

  // Method to save the edited field
  public saveFieldEdit(rowIndex: number, field: string, value: any): void {
    // Prevent auto-save for new records (no id)
    const row = this.gridData.data[rowIndex];
    if (!row.id) {
      // Only update the local value, do not call backend or exit edit mode
      row[field] = value;
      // Do not set this.editingField = null here!
      return;
    }
    const updatedLead = { ...row, [field]: value };
    this.leadService.updateLead(updatedLead.id, updatedLead).subscribe(() => {
      const index = this.allData.findIndex((item) => item.id === updatedLead.id);
      if (index !== -1) {
        this.allData[index] = updatedLead;
        this.updateGridData();
      }
      this.editingField = null; // Exit edit mode for existing records only
      Swal.fire({
        icon: 'success',
        title: 'Field Updated',
        text: 'The field has been successfully updated!',
        timer: 2000,
        showConfirmButton: false,
      });
    });
  }

  // Method to cancel field editing
  public cancelFieldEdit(): void {
    this.editingField = null;
  }

  // Save the current column state as a preference
  savePreference(): void {
    if (!this.grid) {
      console.error('Grid reference is undefined. Ensure the grid is initialized before calling savePreference.');
      return;
    }

    const columnOrder = this.grid.columns
      .map((col: any) => ({
        field: col.field,
        hidden: col.hidden || false,
        width: col.width || null
      }))
      .filter(col => col.field); // Ensure valid fields only

    Swal.fire({
      title: 'Save Preference',
      input: 'text',
      inputLabel: 'Preference name',
      inputPlaceholder: 'Enter preference name',
      showCancelButton: true,
      confirmButtonText: 'Save',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const preference = {
          id: Date.now().toString(16), // Generate a unique ID
          name: result.value,
          columns: columnOrder,
        };

        this.http.post('http://localhost:3000/preferences', preference).subscribe(() => {
          console.log('Preference saved successfully using SweetAlert2.');
          this.loadPreferences();
        });
      }
    });
  }

  // Load saved preferences from the server
  loadPreferences(): void {
    this.http.get<any[]>('http://localhost:3000/preferences').subscribe(
      (preferences) => {
        this.preferences = preferences;
        this.savedPreferencesOptions = preferences.map((pref) => ({
          text: pref.name,
          value: pref.name,
        }));
        console.log('Loaded preferences:', this.preferences);
      },
      (error) => {
        console.error('Failed to load preferences:', error);
      }
    );
  }

  // Apply a saved preference to the grid
  applyPreference(preference: any): void {
    const ordered: string[] = preference.columnOrder;

    this.displayedColumns = ordered
      .map((field: string) => this.columnsConfig.find(c => c.field === field))
      .filter((col): col is { field: string; title: string; width: number } => col !== undefined); // Ensure no undefined values

    console.log('Applied column order:', this.displayedColumns);
  }

  onPreferenceChange(selectedValue: any): void {
    const selectedPref = this.savedPreferencesOptions.find(p => p.value === selectedValue);
    if (selectedPref) {
      this.applyPreference(selectedPref);
    }
  }
}
