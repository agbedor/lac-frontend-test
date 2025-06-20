import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { MartialStatusModel } from '../models/martial-status-model';
@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {

  private http = inject(HttpClient);
  private url = environment.apiUrl;

  maritalstatus = signal<MartialStatusModel[]>([]);

  // Method to fetch and update the signal
  loadmaritalStatus() {
    this.http
      .get<MartialStatusModel[]>(`${this.url}/api/maritalstatus/`)
      .pipe(tap((maritalstatus) => this.maritalstatus.set(maritalstatus)))
      .subscribe();
  }}
