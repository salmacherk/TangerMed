import { TestBed } from '@angular/core/testing';

import { OuvragesService } from './ouvrages.service';

describe('OuvragesService', () => {
  let service: OuvragesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuvragesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
