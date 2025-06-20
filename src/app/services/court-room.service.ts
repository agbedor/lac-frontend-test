import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { CourtRoomModel } from '../models/court-room-model';
@Injectable({
  providedIn: 'root',
})
export class CourtRoomService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  courtrooms = signal<CourtRoomModel[]>([]);

  // Method to fetch and update the signal
  // loadCourtRooms() {
  //   this.http
  //     .get<CourtRoomModel[]>(`${this.url}/api/courtrooms/`)
  //     .pipe(tap((courtrooms) => this.courtrooms.set(courtrooms)))
  //     .subscribe();
  // }

  loadCourtRooms() {
    this.http
      .get<CourtRoomModel[]>(`${this.url}/api/courtrooms/`)
      .pipe(tap((courtrooms) => this.courtrooms.set(courtrooms)))
      .subscribe({
        error: (err) => {
          console.error('Failed to load courtrooms:', err);
        },
      });
  }

  loadCourtRoomsByCourtType(courtTypeId: number) {
    this.http
      .get<CourtRoomModel[]>(
        `${this.url}/api/courtrooms/courttype/${courtTypeId}/`
      )
      .pipe(tap((courtrooms) => this.courtrooms.set(courtrooms)))
      .subscribe();
  }
}
