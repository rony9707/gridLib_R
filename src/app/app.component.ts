import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridComponent } from '../../projects/ag-grid/src/public-api';
import { products } from './excelData';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gridLib';


  excelData = of(products).pipe(delay(2000))

  Config = {
    itemsPerPage: 100,
    theme: 'dark-theme',
    height: '500px',
    columns: [
      { key: 'id', label: 'ID', type: 'number' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'price', label: 'Price', summable: true, type: 'float' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'productCategory', label: 'Product Category', type: 'text' },
      { key: 'productStock', label: 'Product Stock', type: 'number' },
      { key: 'productRating', label: 'Product Rating', type: 'number' },
      { key: 'productSupplier', label: 'Product Supplier', type: 'text' },
      { key: 'productColor', label: 'Product Color', type: 'text' },
      { key: 'warrantyPeriod', label: 'Warranty Period', type: 'number' },
      { key: 'discount', label: 'Discount', type: 'number' },
      { key: 'isFeatured', label: 'isFeatured?', type: 'boolean' },
      { key: 'deliveryType', label: 'Delivery Type', type: 'text' },
    ]
  };


  handleSearch(filters: { column: string, operator: string, value: any }[]) {
    console.log(filters)
  }
  
  

}
