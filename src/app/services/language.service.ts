import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { LanguageModel } from '../models/language-model';
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  languages = signal<LanguageModel[]>([]);

  // Method to fetch and update the signal
  loadLanguages() {
    this.http
      .get<LanguageModel[]>(`${this.url}/api/languages/`)
      .pipe(tap((languages) => this.languages.set(languages)))
      .subscribe();
  }
}
