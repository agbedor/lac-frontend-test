import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ActionService } from '../../../services/action.service';
import { ApplicationService } from '../../../services/application.service';
import { CaseService } from '../../../services/case.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MediatorService } from '../../../services/mediator.service';
import { MediatorModel } from '../../../models/mediator-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionModel } from '../../../models/action-model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDividerModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideNgxMask()],
})
export class DashboardComponent {
  private caseService = inject(CaseService);
  private actionService = inject(ActionService);
  private applicationService = inject(ApplicationService);
  private mediatorService = inject(MediatorService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  @ViewChild('fileInput') fileInput!: ElementRef;
  applicationCount = this.applicationService.applicantCount;
  caseCount = this.caseService.caseCount;
  actionCount = this.actionService.actionCount;
  apps = this.applicationService.applications;
  mediators = this.mediatorService.mediators;
  loading = this.applicationService.loading;
  searchSubject = new BehaviorSubject<string>('');
  tomorrow: string = ''; // Change type to string
  userId: number = 0;
  loadings = false;

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

  selectedApp: any | null = null; // holds the clicked item

  viewDetails(app: any) {
    this.selectedApp = app; // set the selected application
  }

  backToList() {
    this.actionFormGroup.reset(); // ✅ Clears the form
    this.selectedApp = null; // reset to show list again
    this.actionMode = false; // back to detail view
  }

  actionMode = false; // default is view mode

  enableActionMode(app: any) {
    this.selectedApp = app; // set the selected application
    this.actionMode = true; // switch to action view
  }

  disableActionMode() {
    this.actionMode = false; // back to detail view
  }

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.trim() === '') {
            this.applicationService.loadApplications(); // 🧠 <-- reset when input is cleared
            return of([]); // avoid extra fetch
          } else {
            return this.applicationService.searchApplicants(term);
          }
        }),
        catchError((error) => {
          console.error('Search error:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  onBlur(term: string) {
    if (term.trim() !== '') {
      // Reset search if input is not cleared
      this.applicationService.loadApplications();
      this.searchSubject.next(''); // reset subject
    }
  }

  onSearch(event: Event) {
    // if (!this.searchMode) return; // ✅ prevent search if mode is off

    const input = event.target as HTMLInputElement;
    const term = input.value;
    this.searchSubject.next(term);
  }

  selectedFile: File | null = null;
  fileError: string | null = null;

  removeFile() {
    this.selectedFile = null;
    this.fileError = null;

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const uploadDiv = event.currentTarget as HTMLElement;
    uploadDiv.classList.add('drag-over');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const uploadDiv = event.currentTarget as HTMLElement;
    uploadDiv.classList.remove('drag-over');

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateFile(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.validateFile(file);
    }
  }

  validateFile(file: File) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSizeMB = 5;

    if (!allowedTypes.includes(file.type)) {
      this.fileError =
        'Invalid file type. Only PDF and Word files are allowed.';
      this.selectedFile = null;
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      this.fileError = `File is too large. Maximum size is ${maxSizeMB} MB.`;
      this.selectedFile = null;
      return;
    }

    this.fileError = null;
    this.selectedFile = file;
  }

  // displayedApps(): any[] {
  //   if (this.loading()) {
  //     return [{}]; // triggers one row to show the loading row
  //   } else if (this.apps().length === 0) {
  //     return [{}]; // triggers one row to show the "no data" row
  //   }
  //   return this.apps();
  // }

  displayedApps(): any[] {
    return this.apps(); // Always return real data
  }

  ngOnInit() {
    this.applicationService.loadApplications();
    this.applicationService.loadApplicantCount();
    this.actionService.loadActionCount();
    this.caseService.loadCaseCount();
    this.mediatorService.loadMediators();
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    // Format tomorrow as YYYY-MM-DD
    this.tomorrow = nextDay.toISOString().split('T')[0];

    const idFromStorage = localStorage.getItem('id');
    // console.log("ID from localStorage in booking:", idFromStorage);  // <== Add this
    this.userId = idFromStorage ? parseInt(idFromStorage) : 0;
  }

  submit(formGroup: FormGroup): void {
    formGroup.markAllAsTouched();

    // Re-run validations
    formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    if (this.actionFormGroup.invalid) return;

    if (formGroup.valid) {
      // const rawTime = this.actionFormGroup.value.timeCtrl; // e.g. "13:04"
      // const appointmentTime = rawTime ? `${rawTime}:00` : null;

      // const actionData: ActionModel = {
      //   case: this.selectedApp.id,
      //   action_taken: this.actionFormGroup.value.actionTakenCtrl!,
      //   remarks: this.actionFormGroup.value.remarksCtrl!,
      //   mediator_id: this.actionFormGroup.value.mediatorCtrl!.id!,
      //   completed_by_id: this.userId,
      //   appointment_date: this.formatDate(
      //     new Date(this.actionFormGroup.value.dateCtrl!)
      //   ),
      //   appointment_time: appointmentTime!,
      // };
      // console.log('Action Payload:', JSON.stringify(actionData, null, 2));
      // this.loadings = true;
      // this.actionService.createAction(actionData).subscribe({
      //   next: () => {
      //     this.caseService.updateCase(this.selectedApp.id, {
      //       status: 'action taken',
      //     });
      //     this.snackBar.open(
      //       'action taken successful!, Case status updated',
      //       'close',
      //       {
      //         duration: 3000, // 3 seconds
      //         panelClass: ['success-snackbar'], // Optional custom class
      //       }
      //     );
      //     this.backToList();
      //   },
      //   error: (err) => {
      //     console.error('Error creating application', err);
      //     this.snackBar.open('application failed. Please try again.', 'close', {
      //       duration: 3000,
      //       panelClass: ['error-snackbar'],
      //     });
      //   },
      // });
      this.backToList();
    }
  }
}
