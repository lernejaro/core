/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { ExpandingFabComponent } from './expanding-fab.component'

describe('ExpandingFabComponent', () => {
  let component: ExpandingFabComponent
  let fixture: ComponentFixture<ExpandingFabComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandingFabComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandingFabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
