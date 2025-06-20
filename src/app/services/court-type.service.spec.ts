import { TestBed } from '@angular/core/testing';

import { CourtTypeService } from './court-type.service';

describe('CourtTypeService', () => {
  let service: CourtTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourtTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
