import { Directive, ElementRef, Input, OnInit } from '@angular/core';
@Directive({
  selector: '[dynamicAttribute]',
})
export class DynamicAttributesDirective implements OnInit {

  @Input('dynamicAttribute') attrs?: { [key: string]: any } | null;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    if (!this.attrs) return;

    for (const attr in this.attrs) {

      let value = this.attrs[attr];

      /**
       * por padrão ao setar um valor a um atributo que já existe o mesmo tera o valor substituido
       * para manter os dois valores descomentar o bloco abaixo, ou possivelmente adicionar
       * uma configuração extra no input de atributos
       */
      /*if (this.element.nativeElement.hasAttribute(attr)) {
        value = `${this.element.nativeElement.getAttribute(attr)} ${this.attrs[attr]}`;
      }*/

      this.element.nativeElement.setAttribute(attr, value);
    }
  }
}
