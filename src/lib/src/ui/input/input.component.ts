import {Component, OnInit, Input, EventEmitter, Output, HostBinding} from '@angular/core'
import {PaletteService} from '../palette.service'

@Component({
    selector: 'lrn-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

    @Input() public label: string
    @Input() public type: string
    @Input() public name: string
    @Input() public step: number
    @Input() public decimals: number

    @HostBinding('style.width.em')
    @Input() public width: number = 10

    @Input() public disableFloatingLabel: boolean = false

    @Input() public value: any
    @Output() public valueChange = new EventEmitter<any>()

    public color: string

    public focus: boolean = false

    public onFocus() {
        this.focus = true
    }

    public onBlur() {
        this.focus = false
    }

    public onChange(newValue) {
        // TODO: Why do we need this?
        if (this.type == 'number') {
            newValue = Number.parseFloat(newValue)
        }
        this.value = newValue
        this.valueChange.emit(newValue)
    }

    constructor(palette: PaletteService) {
        this.color = palette.color
    }

    ngOnInit() {
    }

}
