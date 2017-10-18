import {
    AfterViewInit,
    Component,
    ContentChildren,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    QueryList,
    ViewEncapsulation,
} from '@angular/core'
import {UniqueIdService} from '../../unique-id.service'
import {RadioButtonComponent} from '../radio-button/radio-button.component'
import {ControlValueAccessor} from '@angular/forms'

@Component({
    selector: 'lrn-radio-button-group',
    template: `
        <div class="wrapper">
            <ng-content></ng-content>
        </div>`,
    styleUrls: ['./radio-button-group.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RadioButtonGroupComponent implements ControlValueAccessor, AfterViewInit {

    private _value: string = null

    private _name: string

    @ContentChildren(forwardRef(() => RadioButtonComponent))
    public _radioButtons: QueryList<RadioButtonComponent>

    @Input()
    public set name(newName: string) {
        this._name = newName
        this._updateRadioButtonNames()
    }

    public get name(): string {
        return this._name
    }

    @Input()
    public set value(newValue: string) {
        if (this._value != newValue) {
            this._value = newValue
            this._updateRadioButtonValues()
            this.emitValueChange()
        }
    }

    public get value(): string {
        return this._value
    }

    @Output() public valueChange = new EventEmitter<string>()

    private emitValueChange() {
        this.valueChange.emit(this._value)
    }

    public ngAfterViewInit() {
        if (!this.name) {
            setTimeout(() => {
                this.name = this.uniqueIdService.getUniqueId('radio-button-group-name-')
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

    private _updateRadioButtonNames(): void {
        if (this._radioButtons != null) {
            this._radioButtons.forEach(radioButton => radioButton.name = this._name)
        }
    }

    private _updateRadioButtonValues(): void {
        if (this._radioButtons != null) {
            this._radioButtons.forEach(radioButton => radioButton.currentValue = this._value)
        }
    }

}
