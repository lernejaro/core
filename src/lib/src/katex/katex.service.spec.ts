import {inject, TestBed} from '@angular/core/testing'

import {KatexService} from './katex.service'

describe('KatexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KatexService],
    })
  })

  it('should be created', inject([KatexService], (service: KatexService) => {
    expect(service).toBeTruthy()
  }))

  it('should be created', inject([KatexService], (service: KatexService) => {
    expect(service.bMatrix([['1', '2'], ['3', '4']]))
      .toBe(`\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}`)
  }))
})
