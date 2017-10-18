import {TestBed, inject} from '@angular/core/testing'
import {PaletteService} from './palette.service'

xdescribe('PaletteService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PaletteService]
        })
    })

    it('should ...', inject([PaletteService], (service: PaletteService) => {
        expect(service).toBeTruthy()
    }))
})
