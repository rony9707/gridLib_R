import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnInputTypePipe } from '../../pipes/column-input-type.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-column-filter',
  standalone: true,
  imports: [FormsModule,ColumnInputTypePipe,CommonModule],
  templateUrl: './column-filter.component.html',
  styleUrl: './column-filter.component.css'
})
export class ColumnFilterComponent {
  @Input() column: any;
  @Input() filterOperators: any;
  @Input() searchTerms: any;
  @Output() applyFiltersEvent = new EventEmitter<void>();

  applyFilters() {
    this.applyFiltersEvent.emit();
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

}
