import { TestBed } from '@angular/core/testing';

import { servicioNoticias } from './servicioNoticias.service';

describe('ServicioNoticiasService', () => {
  let service: servicioNoticias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(servicioNoticias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
