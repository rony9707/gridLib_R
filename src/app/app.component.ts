import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridComponent } from '../../projects/ag-grid/src/public-api';
import { products } from './excelData';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gridLib';


  excelData = products

  Config = {
    itemsPerPage: 100,
    theme: 'light',
    columns: [
      { key: 'id', label: 'ID', searchable: false, sortable: true, type: 'number' },
      { key: 'name', label: 'Name', searchable: true, sortable: true, type: 'text' },
      { key: 'price', label: 'Price', searchable: true, sortable: true, summable: true, type: 'float' },
      { key: 'date', label: 'Date', searchable: true, sortable: true, type: 'date' },
      { key: 'productCategory', label: 'Product Category', searchable: true, sortable: true, type: 'text' },
      { key: 'productStock', label: 'Product Stock', searchable: true, sortable: true, type: 'number' },
      { key: 'productRating', label: 'Product Rating', searchable: true, sortable: true, type: 'number' },
      { key: 'productSupplier', label: 'Product Supplier', searchable: true, sortable: true, type: 'text' },
      { key: 'productColor', label: 'Product Color', searchable: true, sortable: true, type: 'text' },
      { key: 'warrantyPeriod', label: 'Warranty Period', searchable: true, sortable: true, type: 'number' },
      { key: 'discount', label: 'Discount', searchable: true, sortable: true, type: 'number' },
      { key: 'isFeatured', label: 'isFeatured?', searchable: true, sortable: true, type: 'boolean' },
      { key: 'deliveryType', label: 'Delivery Type', searchable: true, sortable: true, type: 'text' },
    ]
  };

}
