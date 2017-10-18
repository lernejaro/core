/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing'
import {UniqueIdService} from './unique-id.service'

describe('UniqueIdService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UniqueIdService]
        })
    })

    it('should get a unique id', inject([UniqueIdService], (service: UniqueIdService) => {
        const id1 = service.getUniqueId()
        const id2 = service.getUniqueId()
        expect(typeof id1).toBe('string')
        expect(typeof id2).toBe('string')
        expect(id1).not.toBe(id2)
        expect(id1).not.toEqual(id2)
    }))
})
