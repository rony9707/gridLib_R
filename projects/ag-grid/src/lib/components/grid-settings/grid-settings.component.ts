import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExcelExportComponent } from '../../svg/excel-export/excel-export.component';
import { LoaderComponent } from '../../svg/loader/loader.component';
import { RemoveFilterComponent } from '../../svg/remove-filter/remove-filter.component';
import { SettingsComponent } from '../../svg/settings/settings.component';

@Component({
  selector: 'lib-grid-settings',
  standalone: true,
  imports: [ExcelExportComponent, LoaderComponent, RemoveFilterComponent, SettingsComponent],
  templateUrl: './grid-settings.component.html',
  styleUrl: './grid-settings.component.css'
})
export class GridSettingsComponent {
  @Input() displayRange!: string;
  @Input() isLoading = false;
  @Input() isExcelExported = false;
  @Input() isAnyFilterAppliedFlag = false;
  @Input() theme = 'light-theme';

  @Output() exportToExcel = new EventEmitter<void>();
  @Output() clearAllFilters = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<MouseEvent>();

  get iconColor(): string {
    return this.theme === 'dark-theme' ? '#ffffff' : '#000000';
  }

  onExportToExcel() {
    this.exportToExcel.emit();
  }

  onClearFilters() {
    this.clearAllFilters.emit();
  }

  onToggleSidebar(event: MouseEvent) {
    this.toggleSidebar.emit(event);
  }
}
