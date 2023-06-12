import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(MatDialog);

  public open(component: any, data: any): MatDialogRef<any> {
    return this.dialog.open(component, {
      minWidth: '80%',
      height: '80vh',
      id: 'parts-dialog',
      disableClose: true,
      autoFocus: false,
      data: {
        ...data
      },
    });
  }
}
