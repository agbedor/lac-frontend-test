import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { PartyModel } from '../models/party-model';
@Injectable({
  providedIn: 'root',
})
export class PartyService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  parties = signal<PartyModel[]>([]);

  // Method to fetch and update the signal
  loadParties() {
    this.http
      .get<PartyModel[]>(`${this.url}/api/parties/`)
      .pipe(tap((parties) => this.parties.set(parties)))
      .subscribe();
  }
}
