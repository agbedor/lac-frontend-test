import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { GenderModel } from '../models/gender-model';
@Injectable({
  providedIn: 'root',
})
export class GenderService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  genders = signal<GenderModel[]>([]);

  // Method to fetch and update the signal
  loadGenders() {
    this.http
      .get<GenderModel[]>(`${this.url}/api/genders/`)
      .pipe(tap((genders) => this.genders.set(genders)))
      .subscribe();
  }
}
