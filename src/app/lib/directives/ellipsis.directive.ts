import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ellipsis]'
})
export class EllipsisDirective implements AfterViewInit {
  @Input() public tooltipText!: string;

  private element!: HTMLElement;

  public constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  public ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement;
    this.renderer.setStyle(this.element, 'display', 'block');
    this.renderer.setStyle(this.element, 'overflow', 'hidden');
    this.renderer.setStyle(this.element, 'textOverflow', 'ellipsis');
    this.renderer.setStyle(this.element, 'whiteSpace', 'nowrap');
  }

  @HostListener('mouseenter') public enter(): void {
    if (this.element.offsetWidth < this.element.scrollWidth) {
      this.renderer.setStyle(this.element, 'cursor', 'pointer');

      if (this.tooltipText !== undefined && this.tooltipText.length > 0) {
        this.element.title = this.tooltipText;
        return;
      } else if (this.element.nodeName === 'INPUT') {
        this.element.title = this.elementRef?.nativeElement?.value;
        return;
      }
      this.element.title = this.element.innerHTML;
    }
  }
}
