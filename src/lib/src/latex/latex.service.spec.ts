import {inject, TestBed} from '@angular/core/testing'

import {LatexService} from './latex.service'

describe('LatexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LatexService],
    })
  })

  it('should be created', inject([LatexService], (service: LatexService) => {
    expect(service).toBeTruthy()
  }))
})
