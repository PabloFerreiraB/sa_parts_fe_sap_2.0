import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';

/**
 * Diretiva que adiciona um contador de caracteres para um campo de texto do tipo textarea.
 *  O contador é exibido no lado direito abaixo do campo usando o mat-error.
 * O número máximo de caracteres permitidos pode ser configurado usando o atributo maxLength.
 * @example
 * <mat-form-field>
 * <textarea matInput customTextAreaCount [maxLength]="500"></textarea>
 * </mat-form-field>
 **/

@Directive({
  standalone: true,
  selector: '[customTextAreaCount]',
})
export class CustomTextAreaCountDirective {
  /**
   * Número máximo de caracteres permitidos no campo de texto.
   * O valor padrão é 4000.
   */
  @Input() maxLength: number = 4000;

  /**
   * Elemento HTML usado para exibir o contador de caracteres.
   */
  private counterElement: HTMLElement;

  constructor(private el: ElementRef, private matFormField: MatFormField) {
    this.counterElement = document.createElement('mat-error');
    this.counterElement.classList.add('custom-error-counter');

    setTimeout(() => {
      try {
        this.matFormField._elementRef.nativeElement.parentElement.appendChild(
          this.counterElement
        );
      } catch (error) {
        console.error('Ocorreu um erro ao inserir a diretiva', error);
      }
    }, 200);
  }

  /**
   * Manipulador de eventos que é chamado sempre que o usuário digita ou exclui um caractere no campo de texto.
   * Calcula o número de caracteres digitados e exibe o contador de caracteres no elemento HTML.
   */
  @HostListener('input') onInput() {
    const textAreaValue = this.el.nativeElement.value;
    const counterText = `${textAreaValue.length} / ${this.maxLength}`;

    if (textAreaValue.length > this.maxLength) {
      this.counterElement.classList.add('invalid');
    }
    else {
      this.counterElement.classList.remove('invalid');
    }

    this.counterElement.innerText = counterText;
  }
}
