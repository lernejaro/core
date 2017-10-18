import {Component, OnInit, Input, EventEmitter, Output, HostBinding} from '@angular/core'

@Component({
    selector: 'lrn-option-picker',
    templateUrl: './option-picker.component.html',
    styleUrls: ['./option-picker.component.scss']
})
export class OptionPickerComponent implements OnInit {

    @Input() public name: string

    @HostBinding('class') @Input() public type = 'radio-button'

    @Input() public options: {value: string, label: string}[] = []

    @Input() public value: string // currently selected

    @Output() public valueChange = new EventEmitter<string>()

    public onSelect(value: string): void {
        this.valueChange.emit(value)
    }

    constructor() {
    }

    ngOnInit() {
    }

}
