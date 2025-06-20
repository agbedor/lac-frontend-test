import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MediatorService } from '../../../../services/mediator.service';
import { MediatorModel } from '../../../../models/mediator-model';
import { CaseModel } from '../../../../models/case-model';
import { ActionModel } from '../../../../models/action-model';
import { ActionService } from '../../../../services/action.service';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CaseService } from '../../../../services/case.service';

@Component({
  selector: 'app-case-form',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTimepickerModule,
    NgxMaskDirective,
  ],
  templateUrl: './case-form.component.html',
  styleUrl: './case-form.component.scss',
  providers: [provideNativeDateAdapter(), provideNgxMask()],
})
export class CaseFormComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { case: CaseModel },
    private dialogRef: MatDialogRef<CaseFormComponent>
  ) {}

  private mediatorService = inject(MediatorService);
  private caseService = inject(CaseService);
  private actionService = inject(ActionService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  isLinear = true;
  loading = false;
  tomorrow?: Date;
  userId: number = 0;

  mediators = this.mediatorService.mediators;

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0]; // "YYYY-MM-DD"
  }

  validateTimeInput() {
    const control = this.actionFormGroup.get('timeCtrl');
    const value = control?.value;

    // Treat default mask value as empty
    if (!value || value === '00:00' || !/^\d{2}:\d{2}$/.test(value)) {
      control?.setErrors({ invalidTime: true });
      return;
    }

    const [hh, mm] = value.split(':').map(Number);
    if (hh > 23 || mm > 59) {
      control?.setErrors({ invalidTime: true });
    } else {
      control?.setErrors(null);
    }
  }

  actionFormGroup = this.fb.group({
    actionTakenCtrl: ['', Validators.required],
    remarksCtrl: ['', Validators.required],
    dateCtrl: [null as Date | null, Validators.required],
    timeCtrl: ['', Validators.required],
    // timeCtrl: ['00:00', Validators.required],
    mediatorCtrl: [null as MediatorModel | null, Validators.required],
  });

  goToNextStep(formGroup: FormGroup, stepper: MatStepper): void {
    // Mark all fields as touched to show validation errors
    formGroup.markAllAsTouched();

    // Re-run validations
    formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    // If form is valid, move to next step
    if (formGroup.valid) {
      stepper.next();
    }
  }

  ngOnInit() {
    this.mediatorService.loadMediators();
    const today = new Date();
    this.tomorrow = new Date(today);
    this.tomorrow.setDate(today.getDate() + 1);
    const idFromStorage = localStorage.getItem('id');
    // console.log("ID from localStorage in booking:", idFromStorage);  // <== Add this
    this.userId = idFromStorage ? parseInt(idFromStorage) : 0;
  }
  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.actionFormGroup.invalid) return;

    const rawTime = this.actionFormGroup.value.timeCtrl; // e.g. "13:04"
    const appointmentTime = rawTime ? `${rawTime}:00` : null;

    const actionData: ActionModel = {
      case: this.data.case.id!,
      action_taken: this.actionFormGroup.value.actionTakenCtrl!,
      remarks: this.actionFormGroup.value.remarksCtrl!,
      mediator_id: this.actionFormGroup.value.mediatorCtrl!.id!,
      completed_by_id: this.userId,
      appointment_date: this.formatDate(
        new Date(this.actionFormGroup.value.dateCtrl!)
      ),
      appointment_time: appointmentTime!,
    };
    console.log('Action Payload:', JSON.stringify(actionData, null, 2));
    this.loading = true;
    this.actionService.createAction(actionData).subscribe({
      next: () => {
        this.caseService.updateCase(this.data.case.id!, {
          status: 'action taken',
        });
        this.snackBar.open(
          'action taken successful!, Case status updated',
          'close',
          {
            duration: 3000, // 3 seconds
            panelClass: ['success-snackbar'], // Optional custom class
          }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error creating application', err);
        this.snackBar.open('application failed. Please try again.', 'close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
