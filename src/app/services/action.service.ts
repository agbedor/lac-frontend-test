import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActionModel } from '../models/action-model';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  actions = signal<ActionModel[]>([]);
  loading = signal(true);
  actionCount = signal<number>(0);

  createAction(action: ActionModel): Observable<ActionModel> {
    return this.http
      .post<ActionModel>(`${this.url}/api/actions/create/`, action)
      .pipe(
        tap((newAction) => {
          const current = this.actions();
          this.actions.set([newAction, ...current]); // Insert new action at the top
          this.loadActionCount();
        })
      );
  }
  // Method to fetch and update the signal
  loadActions() {
    this.http
      .get<ActionModel[]>(`${this.url}/api/actions/`)
      .pipe(
        tap((actions) => this.actions.set(actions)),
        tap(() => this.loading.set(false))
      )
      .subscribe();
  }

  searchActionsSmart(term: string) {
    const params: any = {};
  
    if (/^\d{4}$/.test(term)) {
      // Treat 4-digit numbers as years
      params.appointment_date = term;
    } else if (/^\d+$/.test(term)) {
      // Treat other numbers as IDs
      params.id = term;
    } else if (
      /^\d{4}-\d{2}-\d{2}$/.test(term) ||
      /^\d{4}-\d{2}$/.test(term)
    ) {
      params.appointment_date = term;
    } else if (term.startsWith('mediator:')) {
      params.mediator = term.replace('mediator:', '').trim();
    } else if (term.startsWith('completed_by:')) {
      params.completed_by = term.replace('completed_by:', '').trim();
    } else {
      params.generic = term;
    }
  
    this.loading.set(true);
  
    return this.http
      .get<ActionModel[]>(`${this.url}/api/actions/`, { params })
      .pipe(
        tap((actions) => this.actions.set(actions)),
        tap(() => this.loading.set(false))
      );
  }
  

  // Fetch the count from the backend
  loadActionCount() {
    this.http
      .get<{ count: number }>(`${this.url}/api/actions/count/`)
      .pipe(tap((response) => this.actionCount.set(response.count)))
      .subscribe();
  }
}
