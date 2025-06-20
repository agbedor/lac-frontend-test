import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { NationalityModel } from '../models/nationality-model';
@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  nationalities = signal<NationalityModel[]>([]);

  // Method to fetch and update the signal
  loadNationalities() {
    this.http
      .get<NationalityModel[]>(`${this.url}/api/nationalities/`)
      .pipe(tap((nationalities) => this.nationalities.set(nationalities)))
      .subscribe();
  }
}
