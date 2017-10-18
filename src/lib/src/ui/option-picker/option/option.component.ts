import {Component, OnInit, Input} from '@angular/core'

@Component({
    selector: 'lrn-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {

    @Input() public value: string

    constructor() {
    }

    ngOnInit() {
    }

}
