import { TestBed } from '@angular/core/testing';

import { EmploymentStatusService } from './employment-status.service';

describe('EmploymentStatusService', () => {
  let service: EmploymentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmploymentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
