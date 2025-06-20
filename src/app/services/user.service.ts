import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/api/signin/`, {
      username,
      password,
    });
  }

  signOut(): void {
    // Remove the user's authentication tokens from localStorage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
}
