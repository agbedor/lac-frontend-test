import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { EmploymentStatusModel } from '../models/employment-status-model';
@Injectable({
  providedIn: 'root',
})
export class EmploymentStatusService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  employmentstatus = signal<EmploymentStatusModel[]>([]);

  // Method to fetch and update the signal
  loadEmploymentStatus() {
    this.http
      .get<EmploymentStatusModel[]>(`${this.url}/api/employmentstatus/`)
      .pipe(
        tap((employmentstatus) => this.employmentstatus.set(employmentstatus))
      )
      .subscribe();
  }
}
