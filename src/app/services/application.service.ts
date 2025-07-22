import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { ApplicantModel } from '../models/applicant-model';
import { Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  applications = signal<ApplicantModel[]>([]);
  loading = signal(true);
  applicantCount = signal<number>(0);
  acceptedCount = signal<number>(0);
  rejectedCount = signal<number>(0);
  inProgressCount = signal<number>(0);
  completedCount = signal<number>(0);
  currentPage = 1;
  pageSize = 5;
  currentSearch = signal<string | null>(null);
  currentStatus = signal<string | null>(null); // NEW

  createApplication(application: ApplicantModel): Observable<ApplicantModel> {
    return this.http
      .post<ApplicantModel>(`${this.url}/api/applications/create/`, application)
      .pipe(
        tap((newApp) => {
          const current = this.applications();
          // this.applications.set([...current, newApp]);
          this.applications.set([newApp, ...current]); // Insert new app at the top
          this.loadApplicantCount(); // 👈 Update count after successful creation
        })
      );
  }

  updateApplication(appId: number, appData: Partial<ApplicantModel>) {
    return this.http
      .patch<ApplicantModel>(
        `${this.url}/api/applications/${appId}/update/`,
        appData
      )
      .pipe(
        tap((updatedApplication) => {
          const currentApplications = this.applications();
          const updatedList = currentApplications.map((c) =>
            c.id === updatedApplication.id ? updatedApplication : c
          );
          this.applications.set(updatedList);
        })
      );
  }

  // Fetch the count from the backend
  loadApplicantCount() {
    this.http
      .get<{
        Accepted: number;
        Rejected: number;
        In_Progress: number;
        Completed: number;
        total: number;
      }>(`${this.url}/api/applications/count/`)
      .pipe(
        tap((response) => {
          // Assuming you have signals or properties for each count
          this.acceptedCount.set(response.Accepted);
          this.rejectedCount.set(response.Rejected);
          this.inProgressCount.set(response.In_Progress);
          this.completedCount.set(response.Completed);
          this.applicantCount.set(response.total);
        })
      )
      .subscribe();
  }

  loadApplications(page = this.currentPage, pageSize = this.pageSize) {
    this.loading.set(true);

    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    this.http
      .get<PaginatedResponse<ApplicantModel>>(`${this.url}/api/applications/`, {
        params,
      })
      .pipe(
        tap((resp) => this.applications.set(resp.results)),
        tap(() => this.loading.set(false))
      )
      .subscribe();
  }

  onNextAll() {
    this.currentPage++;
    const search = this.currentSearch();
    const status = this.currentStatus();

    if (search) {
      this.searchApplicants(
        search,
        status,
        this.currentPage,
        this.pageSize
      ).subscribe();
    } else if (status && status !== 'all') {
      this.loadApplicationsByStatus(status, this.currentPage, this.pageSize);
    } else {
      this.loadApplications(this.currentPage, this.pageSize);
    }
  }

  onPrevAll() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const search = this.currentSearch();
      const status = this.currentStatus();

      if (search) {
        this.searchApplicants(
          search,
          status,
          this.currentPage,
          this.pageSize
        ).subscribe();
      } else if (status && status !== 'all') {
        this.loadApplicationsByStatus(status, this.currentPage, this.pageSize);
      } else {
        this.loadApplications(this.currentPage, this.pageSize);
      }
    }
  }

  onNextFiltered(status: string) {
    this.currentPage++;
    const search = this.currentSearch();
    if (search) {
      this.searchApplicants(
        search,
        status === 'all' ? null : status,
        this.currentPage,
        this.pageSize
      ).subscribe();
    } else {
      this.loadApplicationsByStatus(status, this.currentPage, this.pageSize);
    }
  }

  onPrevFiltered(status: string) {
    if (this.currentPage > 1) {
      this.currentPage--;
      const search = this.currentSearch();
      if (search) {
        this.searchApplicants(
          search,
          status === 'all' ? null : status,
          this.currentPage,
          this.pageSize
        ).subscribe();
      } else {
        this.loadApplicationsByStatus(status, this.currentPage, this.pageSize);
      }
    }
  }

  searchApplicants(
    term: string,
    status: string | null = null,
    page = 1,
    pageSize = this.pageSize
  ) {
    this.loading.set(true);
    this.currentSearch.set(term);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (/^\d+$/.test(term)) {
      params = params.set('id', term);
    } else {
      params = params.set('name', term);
    }

    // ✅ Only set status if it's NOT "all"
    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    return this.http
      .get<PaginatedResponse<ApplicantModel>>(`${this.url}/api/applications/`, {
        params,
      })
      .pipe(
        tap((resp) => this.applications.set(resp.results)),
        tap(() => this.loading.set(false))
      );
  }

  loadApplicationsByStatus(
    status: string, // <-- changed from union
    page: number = this.currentPage,
    pageSize: number = this.pageSize
  ) {
    this.loading.set(true);

    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    this.http
      .get<{ count: number; results: ApplicantModel[] }>(
        `${this.url}/api/applications/`,
        { params }
      )
      .pipe(
        tap((resp) => this.applications.set(resp.results)),
        tap(() => this.loading.set(false))
      )
      .subscribe({
        error: () => this.loading.set(false),
      });
  }
}
