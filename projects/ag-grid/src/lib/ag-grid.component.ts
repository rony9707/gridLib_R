import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatNumberPipe } from './pipes/format-number.pipe';
import { ColumnSumPipe } from './pipes/column-sum.pipe';
import { ColumnInputTypePipe } from './pipes/column-input-type.pipe';
import { Observable } from 'rxjs';
import { ColumnConfig, Config } from './interface/column-config';
import { AgGridService } from './ag-grid.service';
import { ResizeColumnsDirective } from './directives/resize-columns.directive';
import { SettingsComponent } from './svg/settings/settings.component';
import { ExcelExportComponent } from './svg/excel-export/excel-export.component';
import { RemoveFilterComponent } from './svg/remove-filter/remove-filter.component';
import { SearchFilterComponent } from "./svg/search-filter/search-filter.component";
import { LoaderComponent } from "./svg/loader/loader.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PaginationComponent } from "./components/pagination/pagination.component";

@Component({
  selector: 'lib-Ag-Grid',
  standalone: true,
  imports: [FormsModule,
    FormatNumberPipe,
    ColumnSumPipe,
    ColumnInputTypePipe,
    ResizeColumnsDirective,
    SettingsComponent,
    ExcelExportComponent,
    RemoveFilterComponent,
    SearchFilterComponent,
    LoaderComponent,
    DragDropModule,
    CommonModule, PaginationComponent],
  templateUrl: './ar-grid.component.html',
  styleUrl: './ar-grid.component.css'
})
export class AgGridComponent implements OnInit, OnDestroy {

  @Input() Data: any[] = [];
  @Input() Data$: Observable<any[]> | null = null;
  @Input() Config: Config = {
    itemsPerPage: 50,
    theme: 'light-theme', // light or dark
    width: '100%',
    height: '100%',
    columns: []
  };

  @Output() searchQuery = new EventEmitter<{ column: string, operator: string, value: any }[]>();

  ColumnHeadings: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerms: { [key: string]: string } = {};
  filterOperators: { [key: string]: string } = {};
  filterApplied: { [key: string]: boolean } = {};

  isLoading = false
  isAnyFilterAppliedFlag = false;
  isShowSlider = false
  isExcelExported = false
  isDragging = false;

  @ViewChild('slider', { static: false }) slider?: ElementRef;

  private services = inject(AgGridService)


  ngOnInit(): void {
    if (this.Data$) {
      this.Data$.subscribe(data => {
        this.Data = data;
        this.initializeGrid();
        this.initializeOperators();
        this.applyFilters();
        this.isLoading = true
      });
    } else {
      this.initializeGrid();
      this.initializeOperators();
      this.applyFilters();
    }

  }

  ngOnDestroy(): void {

  }

  initializeOperators() {
    this.ColumnHeadings.forEach(column => {
      if (column.type === 'number' || column.type === 'date' || column.type === 'float') {
        this.filterOperators[column.key] = '=';  // Default for numeric and date types
      } else if (column.type === 'text') {
        this.filterOperators[column.key] = '%';  // Default for text fields
      }
    });
  }


  initializeGrid() {
    if (this.Config.columns?.length) {
      this.ColumnHeadings = this.Config.columns.map((column: ColumnConfig) => ({
        key: column.key,
        label: column.label,
        type: column.type,
        searchable: column.searchable ?? true,   // Default to true
        sortable: column.sortable ?? true,       // Default to true
        summable: column.summable ?? false,      // Default to false
        visible: column.visible ?? true          // Ensure visibility is true by default
      }));
    } else if (this.Data.length) {
      this.ColumnHeadings = Object.keys(this.Data[0]).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        searchable: true,
        sortable: true,
        summable: false,
        visible: true // Ensure default visibility
      }));
    }
  }


  exportToExcel() {
    this.isExcelExported = true;
    let dataTOExportToExcel = this.filteredData.length < this.Data.length ? this.filteredData : this.Data;

    // Use ColumnHeadings instead of Config.columns
    const visibleColumns = this.ColumnHeadings.filter(col => col.visible !== false);

    // Map data to only include visible columns
    const filteredData = dataTOExportToExcel.map(row => {
      let filteredRow: any = {};
      visibleColumns.forEach(col => {
        filteredRow[col.key] = row[col.key];
      });
      return filteredRow;
    });

    this.services.downloadExcel(filteredData, visibleColumns).subscribe(
      (blob) => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'data.xlsx';
        link.click();
        URL.revokeObjectURL(url);
        this.isExcelExported = false;
      },
      (err) => {
        console.error(err);
        this.isExcelExported = false;
      }
    );
  }



  applyFilters() {
    this.isAnyFilterAppliedFlag = false;
    this.filteredData = this.Data.filter(item => {
      return this.ColumnHeadings.every(column => {
        const term = this.searchTerms[column.key]?.trim();
        if (!term) return true;
        this.isAnyFilterAppliedFlag = true;

        const value = item[column.key];
        if (value === undefined || value === null) return false;

        const operator = this.filterOperators[column.key] || '=';

        if (column.type === 'number' || column.type === 'float') {
          const termValue = parseFloat(term);
          if (isNaN(termValue)) return false;

          const itemValue = Number(value);

          switch (operator) {
            case '=': return itemValue === termValue;
            case '>': return itemValue > termValue;
            case '<': return itemValue < termValue;
            case '>=': return itemValue >= termValue;
            case '<=': return itemValue <= termValue;
            default: return true;
          }
        }

        if (column.type === 'date') {
          const termDate = new Date(term);
          if (isNaN(termDate.getTime())) return false;

          const termValue = termDate.getTime();
          const itemValue = new Date(value).getTime();

          switch (operator) {
            case '=': return itemValue === termValue;
            case '>': return itemValue > termValue;
            case '<': return itemValue < termValue;
            case '>=': return itemValue >= termValue;
            case '<=': return itemValue <= termValue;
            default: return true;
          }
        }

        return value.toString().toLowerCase().includes(term.toLowerCase());
      });
    });

    // Emit search query for API search
    const searchParams = Object.keys(this.searchTerms)
      .filter(key => this.searchTerms[key]?.trim()) // Filter out empty searches
      .map(key => ({
        column: key,
        operator: this.filterOperators[key] || '=',
        value: this.searchTerms[key].trim()
      }));

    if (searchParams.length > 0) { // Emit only if searchParams is not empty
      this.searchQuery.emit(searchParams);
    }

    this.sortData();

    // Set filterApplied flag for each column where a filter is applied
    this.ColumnHeadings.forEach(column => {
      this.filterApplied[column.key] = !!this.searchTerms[column.key]?.trim();
    });

    // Reset to page 1 on filter change
    this.currentPage = 1;
    this.paginateData();
  }




  sort(column: any) {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  sortData() {
    if (!this.sortColumn) return;

    this.filteredData.sort((a, b) => {
      let valueA = a[this.sortColumn];
      let valueB = b[this.sortColumn];

      if (valueA instanceof Date) valueA = valueA.getTime();
      if (valueB instanceof Date) valueB = valueB.getTime();

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }


  // Code Related to Pagenation Component--------------------------------------------------
  paginateData() {
    const start = (this.currentPage - 1) * this.Config.itemsPerPage;
    const end = start + this.Config.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.paginateData();
  }


  get totalPages() {
    return Math.ceil(this.filteredData.length / this.Config.itemsPerPage);
  }

  isSummable(column: any): boolean {
    return column.summable === true;
  }


  isFilterApplied(columnKey: string): boolean {
    return !!this.searchTerms[columnKey];  // true if there's any text in the search box
  }

  isAnyFilterApplied(): boolean {
    return Object.values(this.searchTerms).some(term => term.trim() !== '');
  }



  // Clear filter for a specific column
  clearColumnFilter(columnKey: string): void {
    this.searchTerms[columnKey] = ''; // Clear the search term
    //this.filterOperators[columnKey] = ''; // Clear the filter operator
    this.applyFilters(); // Reapply filters to update the table
  }

  // Clear all filters
  clearAllFilters(): void {
    this.searchTerms = {}; // Clear all search terms
    //this.filterOperators = {}; // Clear all filter operators
    this.applyFilters(); // Reapply filters to update the table
  }


  onHeaderClick(event: MouseEvent, column: any) {
    // Only sort if the header itself (not input) is clicked
    if ((event.target as HTMLElement).tagName !== 'INPUT') {
      this.sort(column);
    }
  }

  restrictInput(event: KeyboardEvent, columnType: string) {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow numbers and the decimal point for float type
    if (columnType === 'number' || columnType === 'float') {
      const isNumber = charCode >= 48 && charCode <= 57; // Numbers 0-9
      const isDot = event.key === '.'; // Decimal point

      // Prevent input if not a number or a dot for float type
      if (!isNumber && !isDot) {
        event.preventDefault();
      }
    }
  }




  startResize(event: MouseEvent, column: any) {
    console.log(event)
    const targetElement = event.target as HTMLElement;

    // Ensure parentElement exists
    const parentElement = targetElement.parentElement;
    if (!parentElement) {
      return;
    }

    const startX = event.pageX;
    const startWidth = parseInt(document.defaultView!.getComputedStyle(parentElement).width, 10);

    const doDrag = (dragEvent: MouseEvent) => {
      const newWidth = startWidth + (dragEvent.pageX - startX);
      column.width = `${newWidth}px`;
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);

    event.preventDefault();
  }


  get displayRange(): string {
    const start = (this.currentPage - 1) * this.Config.itemsPerPage + 1;
    const end = Math.min(start + this.Config.itemsPerPage - 1, this.filteredData.length);
    return `Showing ${start}-${end} of ${this.filteredData.length}`;
  }

  toggleSidebar(event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering document click
    this.isShowSlider = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDragging) {
      this.isDragging = false; // Reset dragging state
      return; // Skip closing sidebar
    }

    if (
      this.isShowSlider && // Sidebar is open
      this.slider &&
      !this.slider.nativeElement.contains(event.target) // Click is outside the slider
    ) {
      this.isShowSlider = false; // Close the sidebar
    }
  }

  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ColumnHeadings, event.previousIndex, event.currentIndex);
  }


  dropColumnMain(event: CdkDragDrop<ColumnConfig[]>) {
    // Get visible columns
    const visibleColumns = this.ColumnHeadings.filter(col => col.visible);

    // Ensure the dragged column exists in the visible list
    if (event.previousIndex !== event.currentIndex && visibleColumns.length > 1) {
      const movedColumn = visibleColumns[event.previousIndex];

      // Get the actual index of the column in the full ColumnHeadings array
      const oldIndex = this.ColumnHeadings.findIndex(col => col.key === movedColumn.key);
      const newIndex = this.ColumnHeadings.findIndex(
        col => col.key === visibleColumns[event.currentIndex].key
      );

      // Move column within the full ColumnHeadings array
      this.ColumnHeadings.splice(oldIndex, 1);
      this.ColumnHeadings.splice(newIndex, 0, movedColumn);
    }
  }


  // Track when dragging starts
  onDragStarted() {
    this.isDragging = true;
  }

  // Method to check if all columns are selected
  areAllColumnsSelected(): boolean {
    return this.ColumnHeadings.every(column => column.visible);
  }

  // Method to toggle all columns' visibility
  toggleAllColumns(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.ColumnHeadings.forEach(column => column.visible = isChecked);
  }


}
