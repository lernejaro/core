/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing'
import {RendererService} from './renderer.service'

xdescribe('RendererService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RendererService]
        })
    })

    it('should ...', inject([RendererService], (service: RendererService) => {
        expect(service).toBeTruthy()
    }))
})
