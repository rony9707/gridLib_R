import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-column-settings',
  standalone: true,
  imports: [CommonModule, FormsModule,DragDropModule],
  templateUrl: './column-settings.component.html',
  styleUrl: './column-settings.component.css'
})
export class ColumnSettingsComponent {
  @Input() ColumnHeadings: any[] = [];
  @Input() Config: any;
  @Input() isShowSlider = false;
  @Output() sliderState = new EventEmitter<boolean>();
  @Output() isDragging = new EventEmitter<boolean>();
  @Output() columnOrderChanged = new EventEmitter<any[]>();  // Emit updated columns to parent

  @ViewChild('slider', { static: true }) sliderRef!: ElementRef;

  areAllColumnsSelected(): boolean {
    return this.ColumnHeadings.every(col => col.visible);
  }

  toggleAllColumns(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.ColumnHeadings.forEach(col => (col.visible = isChecked));
  }

  dropColumn(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.ColumnHeadings, event.previousIndex, event.currentIndex);
    this.columnOrderChanged.emit(this.ColumnHeadings); // Send updated array to parent
  }

  onDragStarted(): void {
    this.isDragging.emit(true)
  }

  closeSlider(){
    this.sliderState.emit(false)
  }
}
