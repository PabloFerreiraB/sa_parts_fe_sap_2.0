import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/lib/dialogs/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/lib/dialogs/confirmation-dialog/confirmation-dialog.component';
import { JustifyDialogComponent, JustifyDialogData } from 'src/app/lib/dialogs/justify-dialog/justify-dialog.component';

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

  public alert(message: string): any {
    return this.dialog.open(AlertDialogComponent, {
      width: '950px',
      data: message,
      panelClass: 'alert-dialog'
    });
  }

  public confirmation(message: string): any {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '950px',
      data: message,
      panelClass: 'confirmation-dialog'
    });
  }

  public justify(justify: JustifyDialogData): any {
    return this.dialog.open(JustifyDialogComponent, {
      width: '950px',
      data: justify,
      panelClass: 'justify-dialog'
    });
  }
}
