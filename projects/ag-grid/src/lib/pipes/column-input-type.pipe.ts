import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnInputType',
  standalone: true
})
export class ColumnInputTypePipe implements PipeTransform {
  transform(column: any): string {
    switch (column.type) {
      case 'number':
      case 'float':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  }
}
