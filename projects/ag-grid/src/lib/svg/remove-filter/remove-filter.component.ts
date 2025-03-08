import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-remove-filter',
  standalone: true,
  imports: [],
  templateUrl: './remove-filter.component.html',
  styleUrl: './remove-filter.component.css'
})
export class RemoveFilterComponent {
  @Input() fillColor?: string | null
}
