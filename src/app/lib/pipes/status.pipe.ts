import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  transform(value: string): any {
    if (value === 'A') {
      return 'Ativo';
    } else {
      return 'Inativo';
    }
  }
}
