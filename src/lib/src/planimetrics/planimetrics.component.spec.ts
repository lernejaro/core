/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {PlanimetricsComponent} from './planimetrics.component'

xdescribe('PlanimetricsComponent', () => {
    let component: PlanimetricsComponent
    let fixture: ComponentFixture<PlanimetricsComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlanimetricsComponent]
        })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(PlanimetricsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
