import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ColumnConfig } from './interface/column-config';

@Injectable({
  providedIn: 'root'
})
export class AgGridService {

  constructor() { }

  private http = inject(HttpClient)

  downloadExcel(data: any[],configColumns:ColumnConfig[] | undefined) {
  // const url = 'http://localhost:3000/download-excel';
   const url = 'https://excel-export-node-3jwz.vercel.app/download-excel';

    return this.http.post(url, {
      data: data,
      config: configColumns
  },{
      responseType: 'blob' // Important for downloading file
    });
  }
}
