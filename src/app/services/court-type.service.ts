import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { CourtTypeModel } from '../models/court-type-model';
@Injectable({
  providedIn: 'root',
})
export class CourtTypeService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  courttypes = signal<CourtTypeModel[]>([]);

  // Method to fetch and update the signal
  loadCourtTypes() {
    this.http
      .get<CourtTypeModel[]>(`${this.url}/api/courttypes/`)
      .pipe(tap((courttypes) => this.courttypes.set(courttypes)))
      .subscribe();
  }
}
