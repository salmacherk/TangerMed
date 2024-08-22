import { TestBed } from '@angular/core/testing';

import { ActifsService } from './actifs.service';

describe('ActifsService', () => {
  let service: ActifsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActifsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
