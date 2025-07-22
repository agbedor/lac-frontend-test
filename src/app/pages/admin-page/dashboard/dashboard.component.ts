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
  filter,
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
import { CaseTypeService } from '../../../services/case-type.service';
import { FilenamePipe } from '../../../filename.pipe';

type StatusType = 'all' | 'accepted' | 'rejected' | 'in progress' | 'completed';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDividerModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    FilenamePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideNgxMask()],
})
export class DashboardComponent {
  private caseService = inject(CaseService);
  private actionService = inject(ActionService);
  public applicationService = inject(ApplicationService);
  private mediatorService = inject(MediatorService);
  private casetypeService = inject(CaseTypeService);
  casetypes = this.casetypeService.casetypes;
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  @ViewChild('fileInput') fileInput!: ElementRef;
  applicationCount = this.applicationService.applicantCount;
  rejCount = this.applicationService.rejectedCount;
  accCount = this.applicationService.acceptedCount;
  inpCount = this.applicationService.inProgressCount;
  compCount = this.applicationService.completedCount;
  caseCount = this.caseService.caseCount;
  actionCount = this.actionService.actionCount;
  apps = this.applicationService.applications;
  mediators = this.mediatorService.mediators;
  loading = this.applicationService.loading;
  searchSubject = new BehaviorSubject<string>('');
  tomorrow: string = ''; // Change type to string
  userId: number = 0;
  loadings = false;
  userGroup: string | null = null;
  username: string | null = null;
  actionMode = false; // default is view mode

  // FORM GROUP
  actionFormGroup = this.fb.group({
    actionTakenCtrl: ['', Validators.required],
    remarksCtrl: ['', Validators.required],
    dateCtrl: [null as Date | null, Validators.required],
    timeCtrl: ['', Validators.required],
    // timeCtrl: ['00:00', Validators.required],
    mediatorCtrl: [null as MediatorModel | null, Validators.required],
  });
  // FORM GROUP

  // DATE FORMAT
  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0]; // "YYYY-MM-DD"
  }
  // DATE FORMAT

  // TIME FORMAT
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
  // TIME FORMAT

  // PASSING DATA TO VIEWDETS
  selectedApp: any | null = null; // holds the clicked item

  viewDetails(app: any) {
    this.selectedApp = app; // set the selected application
  }

  backToList() {
    this.actionFormGroup.reset(); // ✅ Clears the form
    this.selectedApp = null; // reset to show list again
    this.actionMode = false; // back to detail view
  }

  enableActionMode(app: any) {
    this.selectedApp = app; // set the selected application
    this.actionMode = true; // switch to action view
  }

  disableActionMode() {
    this.actionMode = false; // back to detail view
  }
  // PASSING DATA TO VIEWDETS

  // FILTERING STATUS
  statusOptions: { label: string; value: StatusType }[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Completed', value: 'completed' },
  ];

  selectedStatus: StatusType = 'all';

  filterApplications(status: StatusType) {
    this.selectedStatus = status;
    this.applicationService.currentPage = 1;
    this.applicationService.currentStatus.set(status);

    const search = this.applicationService.currentSearch();

    if (search) {
      this.applicationService.searchApplicants(search, status).subscribe();
    } else if (status === 'all') {
      this.applicationService.loadApplications();
    } else {
      this.applicationService.loadApplicationsByStatus(status);
    }
  }

  onNext() {
    if (this.selectedStatus === 'all') {
      this.applicationService.onNextAll();
    } else {
      this.applicationService.onNextFiltered(this.selectedStatus);
    }
  }

  onPrev() {
    if (this.selectedStatus === 'all') {
      this.applicationService.onPrevAll();
    } else {
      this.applicationService.onPrevFiltered(this.selectedStatus);
    }
  }
  // FILTERING STATUS

  // FILTERING SEARCH
  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const trimmed = term.trim();
          const status = this.selectedStatus;

          if (trimmed === '') {
            this.applicationService.currentSearch.set(null);
            this.applicationService.currentPage = 1;

            if (status === 'all') {
              this.applicationService.loadApplications();
            } else {
              this.applicationService.loadApplicationsByStatus(status);
            }

            return of([]);
          } else {
            this.applicationService.currentPage = 1;

            return this.applicationService.searchApplicants(
              trimmed,
              status === 'all' ? null : status,
              1,
              this.applicationService.pageSize
            );
          }
        }),
        catchError((error) => {
          console.error('Search error:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const term = input.value;
    this.applicationService.currentPage = 1;
    this.searchSubject.next(term);
  }
  // FILTERING SEARCH

  // FILE SELECTION
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
  // FILE SELECTION

  // THIS ALLOWS ME TO PULL DIRECLTY FROM THE API INSTEAD OF LIMITING DATA TO THE MODEL
  displayedApps(): any[] {
    return this.apps(); // Always return real data
  }
  // THIS ALLOWS ME TO PULL DIRECLTY FROM THE API INSTEAD OF LIMITING DATA TO THE MODEL

  // SOON AT THE PAGE LOADS RUN ONCE
  ngOnInit() {
    this.userGroup = localStorage.getItem('group'); // ✅ Load user group
    this.username = localStorage.getItem('username'); // ✅ Load user group
    this.casetypeService.loadCaseTypes();
    this.applicationService.loadApplications();
    // Reset pagination & filters every time dashboard loads
    this.applicationService.currentPage = 1;
    // this.applicationService.selectedStatus = 'all';
    // this.applicationService.searchTerm = '';
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
  // SOON AT THE PAGE LOADS RUN ONCE

  // SUBMIT
  submit(formGroup: FormGroup): void {
    formGroup.markAllAsTouched();
    formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    if (this.actionFormGroup.invalid) return;

    const rawTime = this.actionFormGroup.value.timeCtrl;
    const appointmentTime = rawTime ? `${rawTime}:00` : null;

    const actionData: ActionModel = {
      applicant: this.selectedApp.id,
      action_taken: this.actionFormGroup.value.actionTakenCtrl!,
      remarks: this.actionFormGroup.value.remarksCtrl!,
      // mediator_id: this.actionFormGroup.value.mediatorCtrl!.id,
      mediator_id: this.actionFormGroup.value.mediatorCtrl!.id!,
      completed_by_id: this.userId,
      appointment_date: this.formatDate(
        new Date(this.actionFormGroup.value.dateCtrl!)
      ),
      appointment_time: appointmentTime!,
    };

    console.log('Action Payload:', JSON.stringify(actionData, null, 2));
    this.loadings = true;

    this.actionService.createAction(actionData).subscribe({
      next: () => {
        // ✅ Now update status after action is created
        this.applicationService
          .updateApplication(this.selectedApp.id, {
            status: 'In Progress',
          })
          .subscribe({
            next: () => {
              // this.loadings = false;
              this.snackBar.open(
                'Action taken successfully! Case status updated',
                'close',
                {
                  duration: 3000,
                  panelClass: ['success-snackbar'],
                }
              );
              this.backToList();
            },
            error: (err) => {
              // this.loadings = false;
              console.error('Error updating application', err);
              this.snackBar.open('Failed to update case status', 'close', {
                duration: 3000,
                panelClass: ['error-snackbar'],
              });
            },
          });
      },
      error: (err) => {
        this.loadings = false;
        console.error('Error creating action', err);
        this.snackBar.open('Action failed. Please try again.', 'close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
  // SUBMIT
}
