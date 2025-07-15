import { Component, inject } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../services/application.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject, of } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { EmploymentStatusService } from '../../../services/employment-status.service';
import { MaritalStatusService } from '../../../services/marital-status.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    LayoutComponent,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    CommonModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class ApplicationsComponent {
  private employmentstatusService = inject(EmploymentStatusService);
  private maritalstatusService = inject(MaritalStatusService);
  employmentstatus = this.employmentstatusService.employmentstatus;
  maritalstatus = this.maritalstatusService.maritalstatus;
  private appService = inject(ApplicationService);
  apps = this.appService.applications;
  loading = this.appService.loading;
  applicationCount = this.appService.applicantCount;
  dialog = inject(MatDialog);
  searchSubject = new BehaviorSubject<string>('');

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  displayedApps() {
    if (this.loading()) {
      return [{}]; // triggers one row to show the loading row
    } else if (this.apps().length === 0) {
      return [{}]; // triggers one row to show the "no data" row
    }
    return this.apps();
  }

  // toggleSearch(input?: HTMLInputElement) {
  //   // if (this.searchMode) {
  //     if (input) input.value = '';
  //     this.searchSubject.next(''); // trigger reset through subject
  //     this.appService.loadApplications(); // 👈 optional but good to force full reset
  //   // }
  //   // this.searchMode = !this.searchMode;
  // }

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.trim() === '') {
            this.appService.loadApplications(); // 🧠 <-- reset when input is cleared
            return of([]); // avoid extra fetch
          } else {
            return this.appService.searchApplicants(term);
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
    // if (!this.searchMode) return; // ✅ prevent search if mode is off

    const input = event.target as HTMLInputElement;
    const term = input.value;
    this.searchSubject.next(term);
  }

  changePageSize(_t41: any) {
    throw new Error('Method not implemented.');
  }
  goToPreviousPage() {
    throw new Error('Method not implemented.');
  }
  goToNextPage() {
    throw new Error('Method not implemented.');
  }
  currentPage: any;
  // pageSize: any;
  totalPages: any;

  ngOnInit() {
    this.appService.loadApplications();
    this.appService.loadApplicantCount();
    this.employmentstatusService.loadEmploymentStatus();
    this.maritalstatusService.loadmaritalStatus();
  }

  createDialog() {
    this.dialog.open(ApplicationFormComponent, {
      width: '800px',
      height: '800px',
      disableClose: true,
    });

    // // After dialog closes, reload list if a expense was created
    // dialogRef.afterClosed().subscribe((created) => {
    //   if (created) {
    //     // this.loadExpenses();
    //     // this.loadCountTotal();
    //   }
    // });
  }
}
