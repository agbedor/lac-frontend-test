import { Component, inject } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActionService } from '../../../services/action.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MediatorService } from '../../../services/mediator.service';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [
    LayoutComponent,
    MatPaginatorModule,
    MatMenuModule,
    CommonModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {
  private actionService = inject(ActionService);
  actions = this.actionService.actions;
  loading = this.actionService.loading;
  actionCount = this.actionService.actionCount;
  dialog = inject(MatDialog);
  searchId?: number;
  searchCompletedById?: number;
  searchMediatorId?: number;
  searchAppointmentDate?: string;
  isSearchEnabled = true;
  searchMode = false;
  searchSubject = new BehaviorSubject<string>(''); // BehaviorSubject instead of Subject
  private mediatorService = inject(MediatorService);
  mediators = this.mediatorService.mediators;

  displayedActions() {
    if (this.loading()) {
      return [{}]; // triggers one row to show the loading row
    } else if (this.actions().length === 0) {
      return [{}]; // triggers one row to show the "no data" row
    }
    return this.actions();
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
  pageSize: any;
  totalPages: any;

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.trim() === '') {
            this.actionService.loadActions(); // reset
            return of([]);
          } else {
            return this.actionService.searchActionsSmart(term); // 🔍 call the smart method
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
    this.searchSubject.next(term);
  }

  ngOnInit() {
    this.actionService.loadActions();
    this.actionService.loadActionCount();
    this.mediatorService.loadMediators();
  }
}
