import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { ApplicantModel } from '../models/applicant-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;
  applications = signal<ApplicantModel[]>([]);
  loading = signal(true);
  applicantCount = signal<number>(0);

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

  // Method to fetch and update the signal
  loadApplications() {
    this.http
      .get<ApplicantModel[]>(`${this.url}/api/applications/`)
      .pipe(
        tap((applications) => this.applications.set(applications)),
        tap(() => this.loading.set(false))
      )
      .subscribe();
  }

  // Fetch the count from the backend
  loadApplicantCount() {
    this.http
      .get<{ count: number }>(`${this.url}/api/applications/count/`)
      .pipe(tap((response) => this.applicantCount.set(response.count)))
      .subscribe();
  }

  // searchApplicantsSmart(term: string): void {
  //   const params: any = {};

  //   if (/^\d+$/.test(term)) {
  //     params.id = term;
  //   } else if (term.includes('gender=')) {
  //     params.gender = term.split('=')[1];
  //   } else if (term.includes('marital_status=')) {
  //     params.marital_status = term.split('=')[1];
  //   } else if (term.includes('employment_status=')) {
  //     params.employment_status = term.split('=')[1];
  //   } else if (term.startsWith('first:')) {
  //     params.first_name = term.replace('first:', '').trim();
  //   } else if (term.startsWith('last:')) {
  //     params.last_name = term.replace('last:', '').trim();
  //   } else {
  //     // fallback to search both first_name and last_name
  //     params.first_name = term;
  //     params.last_name = term;
  //   }

  //   this.loading.set(true);

  //   this.http
  //     .get<ApplicantModel[]>(`${this.url}/api/applications/`, { params })
  //     .pipe(
  //       tap((apps) => this.applications.set(apps)),
  //       tap(() => this.loading.set(false))
  //     )
  //     .subscribe();
  // }

  searchApplicants(term: string) {
    const params: any = {};

    if (/^\d+$/.test(term)) {
      params.id = term;
    } else {
      params.first_name = term;
      params.last_name = term;
    }

    // const params: any = {};

    // if (/^\d+$/.test(term)) {
    //   params.id = term;
    // } else {
    //   // Try to match either first_name or last_name
    //   params.first_name = term;
    // } 

    this.loading.set(true);

    return this.http
      .get<ApplicantModel[]>(`${this.url}/api/applications/`, { params })
      .pipe(
        tap((apps) => this.applications.set(apps)),
        tap(() => this.loading.set(false))
      );
  }

  filterApplicants(filters: {
    gender?: number;
    employment_status?: number;
    marital_status?: number;
  }): void {
    const params: any = { ...filters };

    this.loading.set(true);

    this.http
      .get<ApplicantModel[]>(`${this.url}/api/applications/`, { params })
      .pipe(
        tap((apps) => this.applications.set(apps)),
        tap(() => this.loading.set(false))
      )
      .subscribe();
  }
}
