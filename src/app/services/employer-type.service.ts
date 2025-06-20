import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { EmployerTypeModel } from '../models/employer-type-model';
@Injectable({
  providedIn: 'root',
})
export class EmployerTypeService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  employertypes = signal<EmployerTypeModel[]>([]);

  // Method to fetch and update the signal
  loadEmployerTypes() {
    this.http
      .get<EmployerTypeModel[]>(`${this.url}/api/employertypes/`)
      .pipe(tap((employertypes) => this.employertypes.set(employertypes)))
      .subscribe();
  }
}
