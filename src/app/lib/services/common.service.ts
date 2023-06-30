import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private loadingQueue: string[] = [];
  public isLoading = false;

  private snackBar = inject(MatSnackBar);
  // constructor(private snackBar: MatSnackBar) { }

  /**
   * Gera uma string com queryParams para ser usada na chamada da API
   * quando um objeto for passado.
   * Quando o valor passado for null ou undefined, ele não será retornado na string normalizada.
   * @param params
   */
  public toQueryString(params: any = {}) {
    return Object.keys(params)
      .filter((key) => params[key] !== 'null' && params[key] !== null)
      .map((key) => {
        if (Array.isArray(params[key])) {
          let url = '';
          const _array = Object.assign([], params[key]) as any[];

          _array.forEach((item, index) => {
            url += `${key}=${item}${index < _array.length - 1 ? '&' : ''}`;
          });

          return url;
        } else {
          return `${key}=${params[key]}`;
        }
      })
      .join('&');
  }

  public showSnack(message: string, duration: number = 3000) {
    this.snackBar.open(message, undefined, { panelClass: 'sipol-snackbar-container', duration });
  }

  public hideSnack() {
    this.snackBar.dismiss();
  }

  public startLoading(message: string = '') {
    this.loadingQueue.push(message);
    this.isLoading = this.loadingQueue.length > 0;
  }

  public stopLoading() {
    this.loadingQueue.pop();
    this.isLoading = this.loadingQueue.length > 0;
  }

  public static validateText(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      const checkTextError = (texto: string) => {
        if (!texto) return false;

        const patterOnlyNumbers = /^\d+$/;
        const patterOnlySpecialCharacters = /^[^\w\s]+$/;
        const patterSpecialCharactersAndNumbers = /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?0-9]*$/;
        const patterOnlyAword = /^\s*[@!#$%&*\w]+\s*$/;

        if (patterOnlyNumbers.test(texto)) return "O campo não permite apenas caracteres numéricos";
        if (patterOnlySpecialCharacters.test(texto)) return "O campo não permite apenas caracteres especiais";
        if (patterSpecialCharactersAndNumbers.test(texto)) {
          return "O campo não permite apenas caracteres especiais e numéricos";
        };
        if (patterOnlyAword.test(texto)) return "O campo não permite apenas uma palavra";

        return false;
      }

      const error = checkTextError(control.value);
      if (!error) {
        return null as any;
      }
      else {
        return { invalidText: error };
      }
    }
  }
}
