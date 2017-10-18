import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core'
import {CheckboxComponent} from '../checkbox/checkbox.component'
import {ControlValueAccessor} from '@angular/forms'
import {UniqueIdService} from '../../unique-id.service'

@Component({
  selector: 'lrn-checkbox-group',
  template: `
    <div class="wrapper">
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['./checkbox-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxGroupComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  private _name: string

  @ContentChildren(forwardRef(() => CheckboxComponent))
  public _checkboxes: QueryList<CheckboxComponent>

  @Input() public value: string[] = []

  @Input()
  public set name(newName: string) {
    this._name = newName
    this._updateCheckboxNames()
  }

  public get name(): string {
    return this._name
  }

  @Output() public valueChange = new EventEmitter<string[]>()

  public toggleValue(value: string) {
    if (this.value.indexOf(value) > -1) {
      this.value = this.value.filter(x => x != value)
    } else {
      this.value = [...this.value, value]
    }
    this.emitValueChange()
  }

  private emitValueChange() {
    this.valueChange.emit(this.value)
  }

  public ngAfterViewInit() {
    if (!this.name) {
      setTimeout(() => {
        this.name = this.uniqueIdService.getUniqueId(`checkbox-group-name-`)
      })
    }
  }

  public writeValue(obj: any): void {
  }

  public registerOnChange(fn: any): void {
  }

  public registerOnTouched(fn: any): void {
  }

  constructor(private uniqueIdService: UniqueIdService) {
  }

  private _updateCheckboxNames(): void {
    if (this._checkboxes != null) {
      this._checkboxes.forEach(checkbox => checkbox.name = this._name)
    }
  }

  private _updateCheckboxValues(): void {
    if (this._checkboxes != null) {
      this._checkboxes.forEach(checkbox => {
        checkbox.currentValue = this.value.indexOf(checkbox.value) > -1
      })
    }
  }

  ngOnInit() {
  }

}
