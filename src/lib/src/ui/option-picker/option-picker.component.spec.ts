/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { OptionPickerComponent } from './option-picker.component'

describe('OptionPickerComponent', () => {
  let component: OptionPickerComponent
  let fixture: ComponentFixture<OptionPickerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionPickerComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionPickerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
