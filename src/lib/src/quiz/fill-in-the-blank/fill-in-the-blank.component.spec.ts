/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {FillInTheBlankComponent} from './fill-in-the-blank.component'

xdescribe('FillInTheBlankComponent', () => {
    let component: FillInTheBlankComponent
    let fixture: ComponentFixture<FillInTheBlankComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FillInTheBlankComponent]
        })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(FillInTheBlankComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
