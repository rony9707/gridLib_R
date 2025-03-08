import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  @Input()fillColor?: string|null
}
