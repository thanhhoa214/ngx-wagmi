import { TestBed } from '@angular/core/testing';

import { NgxWagmiService } from './ngx-wagmi.service';

describe('NgxWagmiService', () => {
  let service: NgxWagmiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxWagmiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
