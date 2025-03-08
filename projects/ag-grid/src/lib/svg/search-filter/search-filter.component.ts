import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-search-filter',
  standalone: true,
  imports: [],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent {
  @Input() fillColor?: string | null
}
