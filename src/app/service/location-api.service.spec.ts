import { TestBed } from '@angular/core/testing';

import { LocationAPIService } from './location-api.service';

describe('LocationAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationAPIService = TestBed.get(LocationAPIService);
    expect(service).toBeTruthy();
  });
});
