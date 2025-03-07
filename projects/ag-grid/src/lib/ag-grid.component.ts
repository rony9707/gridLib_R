import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-Ag-Grid',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ar-grid.component.html',
  styleUrl: './ar-grid.component.css'
})
export class AgGridComponent implements OnInit {

  @Input() Data: any[] = [];
  @Input() Config: any = {
    itemsPerPage: 5,
    theme: 'light', // light or dark
    width: '100%',
    columns: []
  };

  ColumnHeadings: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerms: { [key: string]: string } = {};

  ngOnInit(): void {
    this.initializeGrid();
    this.applyFilters();
  }

  initializeGrid() {
    if (this.Config.columns?.length) {
      this.ColumnHeadings = this.Config.columns;
    } else if (this.Data.length) {
      this.ColumnHeadings = Object.keys(this.Data[0]).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        searchable: true,
        sortable: true,
        summable: false // Default false if no config provided
      }));
    }
  }

  applyFilters() {
    this.filteredData = this.Data.filter(item => {
      return this.ColumnHeadings.every(column => {
        const term = (this.searchTerms[column.key] || '').toLowerCase();
        if (!term) return true;

        const value = item[column.key] ?? '';
        return value.toString().toLowerCase().includes(term);
      });
    });

    this.sortData();
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

  paginateData() {
    const start = (this.currentPage - 1) * this.Config.itemsPerPage;
    const end = start + this.Config.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.Config.itemsPerPage);
  }

  isSummable(column: any): boolean {
    return column.summable === true;
  }

  getColumnSum(key: string): string {
    const sum = this.filteredData.reduce((total, item) => {
      const value = item[key];
      if (typeof value === 'number') {
        return total + value;
      }
      return total;
    }, 0);

    // Round to 4 decimal places and format with commas
    return this.formatNumber(sum);
  }

  getInputType(column: any): string {
    switch (column.type) {
      case 'number':
      case 'float':
        return 'number';
      case 'date':
          return 'date';  
      default:
        return 'text'; // default to text for unknown types
    }
  }


  formatNumber(value: number): string {
    // Convert to a string with 4 decimal places
    const rounded = value.toFixed(4);

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = rounded.split('.');

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine back with decimal part
    return `${formattedInteger}.${decimalPart}`;
  }

  isFilterApplied(columnKey: string): boolean {
    return !!this.searchTerms[columnKey];  // true if there's any text in the search box
  }


  onHeaderClick(event: MouseEvent, column: any) {
    // Only sort if the header itself (not input) is clicked
    if ((event.target as HTMLElement).tagName !== 'INPUT') {
      this.sort(column);
    }
  }


  startResize(event: MouseEvent, column: any) {
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
    let end = this.currentPage * this.Config.itemsPerPage;
    if (end > this.filteredData.length) {
      end = this.filteredData.length;
    }
    const total = this.filteredData.length;
    return `Displaying ${start}-${end} of ${total}`;
  }



}
