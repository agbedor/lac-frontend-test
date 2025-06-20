import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs/operators';
import { BeneficiaryTypeModel } from '../models/beneficiary-type-model';
@Injectable({
  providedIn: 'root',
})
export class BeneficiaryTypeService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  beneficiarytypes = signal<BeneficiaryTypeModel[]>([]);

  // Method to fetch and update the signal
  loadBeneficiaryTypes() {
    this.http
      .get<BeneficiaryTypeModel[]>(`${this.url}/api/beneficiarytypes/`)
      .pipe(
        tap((beneficiarytypes) => this.beneficiarytypes.set(beneficiarytypes))
      )
      .subscribe();
  }
}
