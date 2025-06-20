import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { CaseTypeModel } from '../models/case-type-model';
@Injectable({
  providedIn: 'root',
})
export class CaseTypeService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  casetypes = signal<CaseTypeModel[]>([]);

  // Method to fetch and update the signal
  loadCaseTypes() {
    this.http
      .get<CaseTypeModel[]>(`${this.url}/api/casetypes/`)
      .pipe(tap((casetypes) => this.casetypes.set(casetypes)))
      .subscribe();
  }
}
