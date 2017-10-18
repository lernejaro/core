import {async, ComponentFixture, TestBed} from '@angular/core/testing'
import {PalettePickerComponent} from './palette-picker.component'

xdescribe('PalettePickerComponent', () => {
    let component: PalettePickerComponent
    let fixture: ComponentFixture<PalettePickerComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PalettePickerComponent]
        })
            .compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(PalettePickerComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
