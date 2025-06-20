import { Component, inject } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CaseService } from '../../../services/case.service';
import { CaseFormComponent } from './case-form/case-form.component';
import { CaseModel } from '../../../models/case-model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  filter,
} from 'rxjs/operators';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [
    LayoutComponent,
    MatPaginatorModule,
    MatMenuModule,
    CommonModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss',
})
export class CasesComponent {
  private dialog = inject(MatDialog);
  private caseService = inject(CaseService);
  caseCount = this.caseService.caseCount;
  cases = this.caseService.cases;
  loading = this.caseService.loading;
  isSearchEnabled = true;
  currentPage = this.caseService.currentPage;
  pageSize = this.caseService.pageSize;
  totalPages = this.caseService.totalPages;
  searchMode = false;
  searchSubject = new BehaviorSubject<string>('');

  // load and show
  displayedCases() {
    if (this.loading()) {
      return [{}]; // triggers one row to show the loading row
    } else if (this.cases().length === 0) {
      return [{}]; // triggers one row to show the "no data" row
    }
    return this.cases();
  }

  // search
  toggleSearch(input?: HTMLInputElement) {
    if (this.searchMode) {
      if (input) input.value = '';
      this.searchSubject.next(''); // trigger reset through subject
      this.caseService.loadCases(); // 👈 optional but good to force full reset
    }
    this.searchMode = !this.searchMode;
  }

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.trim() === '') {
            this.caseService.loadCases(); // 🧠 <-- reset when input is cleared
            return of([]); // avoid extra fetch
          } else {
            return this.caseService.searchCases(term);
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
    if (!this.searchMode) return; // ✅ prevent search if mode is off

    const input = event.target as HTMLInputElement;
    const term = input.value;
    this.searchSubject.next(term);
  }

  // filter
  filterCases(status: 'pending' | 'action taken' | 'all') {
    if (status === 'all') {
      this.caseService.loadCases();
    } else {
      this.caseService.loadCasesByStatus(status);
    }
  }

  // pagination
  changePageSize(size: number) {
    // this.caseService.loadCases(1, size); // Reset to first page when size changes
  }

  goToPreviousPage() {
    const prevPage = this.currentPage() - 1;
    if (prevPage >= 1) {
      // this.caseService.loadCases(prevPage, this.pageSize());
    }
  }

  goToNextPage() {
    const nextPage = this.currentPage() + 1;
    if (nextPage <= this.totalPages()) {
      // this.caseService.loadCases(nextPage, this.pageSize());
    }
  }

  createDialog(cases: CaseModel): void {
    if (cases.status !== 'pending') {
      return;
    }

    this.dialog.open(CaseFormComponent, {
      width: '800px',
      height: '800px',
      data: { case: cases },
      disableClose: false,
    });
  }

  ngOnInit() {
    this.caseService.loadCases();
    this.caseService.loadCaseCount();
  }
}
