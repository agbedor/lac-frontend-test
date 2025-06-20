import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
// import { Observable } from 'rxjs';
import { CaseModel } from '../models/case-model';
import { PaginatedResponse } from '../models/paginated-response-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  private _cases = signal<CaseModel[]>([]);
  private _loading = signal(true);
  private _caseCount = signal<number>(0);
  private _currentPage = signal<number>(1);
  private _pageSize = signal<number>(10);
  private _totalPages = signal<number>(1);

  get cases() {
    return this._cases;
  }
  get caseCount() {
    return this._caseCount;
  }
  get loading() {
    return this._loading;
  }
  get currentPage() {
    return this._currentPage;
  }
  get pageSize() {
    return this._pageSize;
  }
  get totalPages() {
    return this._totalPages;
  }

  // Method to fetch and update the signal
  loadCases() {
    this.http
      .get<CaseModel[]>(`${this.url}/api/cases/`)
      .pipe(
        tap((cases) => this.cases.set(cases)),
        tap(() => this.loading.set(false))
      )
      .subscribe();
  }

  // loadCases(): Observable<CaseModel[]> {
  //   return this.http.get<CaseModel[]>(`${this.url}/api/cases/`).pipe(
  //     tap((cases) => this.cases.set(cases)),
  //     tap(() => this.loading.set(false))
  //   );
  // }

  // Fetch the count from the backend
  loadCaseCount() {
    this.http
      .get<{ count: number }>(`${this.url}/api/cases/count/`)
      .pipe(tap((response) => this.caseCount.set(response.count)))
      .subscribe();
  }

  loadCasesByStatus(status: 'pending' | 'action taken') {
    this.loading.set(true);
    this.http
      .get<CaseModel[]>(`${this.url}/api/cases/`, { params: { status } })
      .pipe(
        tap((cases) => this.cases.set(cases)),
        tap(() => this.loading.set(false))
      )
      .subscribe();
  }

  searchCases(term: string, status?: string) {
    const queryParams: any = {};
    if (term) queryParams.search = term;
    if (status) queryParams.status = status;

    this.loading.set(true);

    return this.http
      .get<CaseModel[]>(`${this.url}/api/cases/`, { params: queryParams })
      .pipe(
        tap((cases) => this.cases.set(cases)),
        tap(() => this.loading.set(false))
      );
  }

  updateCase(caseId: number, caseData: Partial<CaseModel>) {
    this.http
      .patch<CaseModel>(`${this.url}/api/cases/${caseId}/update`, caseData)
      .pipe(
        tap((updatedCase) => {
          const currentCases = this.cases(); // get the current signal value (array of cases)
          const updatedList = currentCases.map(
            (c) => (c.id === updatedCase.id ? updatedCase : c) // replace the updated case
          );
          this.cases.set(updatedList); // update the signal value
        })
      )
      .subscribe();
  }
}
