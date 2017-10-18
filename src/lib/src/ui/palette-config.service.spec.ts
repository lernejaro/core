import { TestBed, inject } from '@angular/core/testing'

import { PaletteConfigService } from './palette-config.service'

describe('PaletteConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaletteConfigService]
    })
  })

  it('should ...', inject([PaletteConfigService], (service: PaletteConfigService) => {
    expect(service).toBeTruthy()
  }))
})
