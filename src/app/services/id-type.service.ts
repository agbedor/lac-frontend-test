import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { IdTypeModel } from '../models/id-type-model';

@Injectable({
  providedIn: 'root',
})
export class IdTypeService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  idtypes = signal<IdTypeModel[]>([]);

  // Method to fetch and update the signal
  loadIdTypes() {
    this.http
      .get<IdTypeModel[]>(`${this.url}/api/idtypes/`)
      .pipe(tap((idtypes) => this.idtypes.set(idtypes)))
      .subscribe();
  }
}
