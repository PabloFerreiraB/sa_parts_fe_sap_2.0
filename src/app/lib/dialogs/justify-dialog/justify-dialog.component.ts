import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonService } from '../../services/common.service';

export interface JustifyDialogData {
  justifyTitle: string;
  justifyTab: string;
  justifyLabel: string;
  justifyText?: string;
  disabled?: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatTabsModule, MatFormFieldModule, ReactiveFormsModule],
  selector: 'app-justify-dialog',
  templateUrl: './justify-dialog.component.html',
  styleUrls: ['./justify-dialog.component.scss'],
})
export class JustifyDialogComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JustifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JustifyDialogData
  ) {
    this.form = this.fb.group({
      justifyText: [data.justifyText, [
        Validators.required,
        Validators.maxLength(4000),
        CommonService.validateText()
      ]]
    });

    if ('disabled' in data) {
      if (data.disabled) {
        this.form.controls['justifyText'].disable();
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valueForm = this.form.value;
    this.dialogRef.close(valueForm.justifyText);
  }
}
