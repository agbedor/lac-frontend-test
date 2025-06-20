import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { MediatorModel } from '../models/mediator-model';

@Injectable({
  providedIn: 'root',
})
export class MediatorService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  mediators = signal<MediatorModel[]>([]);

  // Method to fetch and update the signal
  loadMediators() {
    this.http
      .get<MediatorModel[]>(`${this.url}/api/mediators/`)
      .pipe(tap((mediators) => this.mediators.set(mediators)))
      .subscribe();
  }
}
