import { TestBed } from '@angular/core/testing';

import { SelectFormService } from './select-form.service';

describe('SelectFormService', () => {
  let service: SelectFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
