import { TestBed } from '@angular/core/testing';

import { BeneficiaryTypeService } from './beneficiary-type.service';

describe('BeneficiaryTypeService', () => {
  let service: BeneficiaryTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaryTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
