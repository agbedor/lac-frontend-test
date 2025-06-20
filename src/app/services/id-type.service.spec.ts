import { TestBed } from '@angular/core/testing';

import { IdTypeService } from './id-type.service';

describe('IdTypeService', () => {
  let service: IdTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
