import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number, decimalPlaces = 4): string {
    if (value == null) return '';

    const rounded = value.toFixed(decimalPlaces);
    const [integerPart, decimalPart] = rounded.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${formattedInteger}.${decimalPart}`;
  }
}
