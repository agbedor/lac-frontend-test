import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { TitleModel } from '../models/title-model';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  titles = signal<TitleModel[]>([]);

  // Method to fetch and update the signal
  loadTitles() {
    this.http
      .get<TitleModel[]>(`${this.url}/api/titles/`)
      .pipe(tap((titles) => this.titles.set(titles)))
      .subscribe();
  }
}
