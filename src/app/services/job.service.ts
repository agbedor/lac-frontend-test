import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { JobModel } from '../models/job-model';
@Injectable({
  providedIn: 'root',
})
export class JobService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  jobs = signal<JobModel[]>([]);

  // Method to fetch and update the signal
  loadJobs() {
    this.http
      .get<JobModel[]>(`${this.url}/api/jobs/`)
      .pipe(tap((titles) => this.jobs.set(titles)))
      .subscribe();
  }
}
