import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnSum',
  standalone: true
})
export class ColumnSumPipe implements PipeTransform {
  transform(data: any[], key: string): number {
    if (!data || !key) return 0;

    return data.reduce((total, item) => {
      const value = item[key];
      if (typeof value === 'number') {
        return total + value;
      }
      return total;
    }, 0);
  }
}
