/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {SlideComponent} from './slide.component'

xdescribe('SlideComponent', () => {
    let component: SlideComponent
    let fixture: ComponentFixture<SlideComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlideComponent]
        })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(SlideComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
