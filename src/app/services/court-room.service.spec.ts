import { TestBed } from '@angular/core/testing';

import { CourtRoomService } from './court-room.service';

describe('CourtRoomService', () => {
  let service: CourtRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourtRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
