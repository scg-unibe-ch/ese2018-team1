import { TestBed } from '@angular/core/testing';

import { SurpriseService } from './surprise.service';

describe('SurpriseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurpriseService = TestBed.get(SurpriseService);
    expect(service).toBeTruthy();
  });
});
