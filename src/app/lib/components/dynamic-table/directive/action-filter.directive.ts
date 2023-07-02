import { Pipe, PipeTransform } from '@angular/core';
import { Actions } from '../interfaces';

@Pipe({
  name: 'actionFilter'
})
export class ActionFilterPipe implements PipeTransform {

  transform(actions: Actions[], parameter?: any): any[] {
    return actions.filter(action => {
      if (!action.conditional) return action;
      return action.conditional(parameter);
    })
  }
}
