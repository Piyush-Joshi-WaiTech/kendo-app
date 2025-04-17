import { Component, ViewChild, OnInit } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
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
export class LeadManagementComponent implements OnInit {
  constructor(private leadService: LeadManagementService) {}

  @ViewChild('excelExport', { static: false })
  excelExport!: ExcelExportComponent;

  ngOnInit(): void {
    this.loadLeads();
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

  private _searchKeyword: string = '';

  get searchKeyword(): string {
    return this._searchKeyword;
  }

  set searchKeyword(value: string) {
    this._searchKeyword = value;
    this.filterGridData(); // Trigger filtering when the search keyword changes
  }

  activeToggle: string = 'Non-Intl';

  setActiveToggle(option: string): void {
    this.activeToggle = option;
  }

  private allData: any[] = []; // ✅ Don't use LEAD_DATA

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
    };

    this.editingRowIndex = 0;
    const gridCopy = [...this.gridData.data];
    gridCopy.unshift(newRecord);
    this.gridData = {
      data: gridCopy,
      total: this.allData.length,
    };

    this.originalDataItem = JSON.parse(JSON.stringify(newRecord));
  }

  public addRow(): void {
    const newLead = {
      // Don't include `id` at all
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
    };

    this.leadService.addLead(newLead).subscribe((createdLead) => {
      if (createdLead?.id != null) {
        this.allData.unshift(createdLead);
        this.updateGridData();
      } else {
        console.warn(
          'Newly created lead did not return a valid ID:',
          createdLead
        );
      }
    });
  }

  // // TEMPORARY ID GENERATOR
  // private generateTempId(): number {
  //   const maxId = this.allData.length
  //     ? Math.max(...this.allData.map((d) => d.id || 0))
  //     : 0;
  //   return maxId + 1;
  // }

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
      });
    } else {
      // Update existing
      this.leadService
        .updateLead(updatedLead.id, updatedLead) // ✅ Use 'id' here
        .subscribe(() => {
          const index = this.allData.findIndex(
            (item) => item.id === updatedLead.id // ✅ Use 'id' here
          );
          if (index !== -1) {
            this.allData[index] = updatedLead;
            this.updateGridData();
          }
          this.editingRowIndex = null;
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
            console.log(`✅ Lead with ID ${dataItem.id} deleted from db.json`);
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
}
