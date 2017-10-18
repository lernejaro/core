import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core'

@Component({
    selector: 'lrn-expanding-fab',
    templateUrl: './expanding-fab.component.html',
    styleUrls: ['./expanding-fab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExpandingFabComponent implements OnInit {

    public isExpanded: boolean = true

    public toggle() {
        this.isExpanded = !this.isExpanded
    }

    constructor() {
    }

    ngOnInit() {
    }

}
