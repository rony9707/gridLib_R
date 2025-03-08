import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libResizeColumns]',
  standalone: true
})
export class ResizeColumnsDirective {

  private startX: number = 0;
  private startWidth: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    // Only start resize if clicking on resizer (right edge of column)
    const resizer = (event.target as HTMLElement).classList.contains('column-resizer');
    if (!resizer) {
      return;
    }

    this.startX = event.clientX;
    this.startWidth = this.el.nativeElement.offsetWidth;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const newWidth = this.startWidth + (event.clientX - this.startX);
    this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
  };

  private onMouseUp = (): void => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

}
