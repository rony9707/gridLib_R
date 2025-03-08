export interface ColumnConfig {
  key: string;
  label: string;
  type: string;
  searchable?: boolean;  // Optional, defaults will be handled in code
  sortable?: boolean;    // Optional, defaults will be handled in code
  summable?: boolean;
  visible?:boolean
}

export interface Config{
  itemsPerPage: number,
  theme: string, // light or dark
  width?: string,
  height?:string,
  columns?: ColumnConfig[]
}

