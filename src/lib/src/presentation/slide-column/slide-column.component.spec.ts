/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {SlideColumnComponent} from './slide-column.component'

xdescribe('SlideColumnComponent', () => {
    let component: SlideColumnComponent
    let fixture: ComponentFixture<SlideColumnComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlideColumnComponent]
        })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(SlideColumnComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
