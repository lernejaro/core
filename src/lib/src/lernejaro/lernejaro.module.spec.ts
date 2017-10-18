import { LernejaroModule } from './lernejaro.module'

describe('LernejaroModule', () => {
  let lernejaroModule: LernejaroModule

  beforeEach(() => {
    lernejaroModule = new LernejaroModule()
  })

  it('should create an instance', () => {
    expect(lernejaroModule).toBeTruthy()
  })
})
