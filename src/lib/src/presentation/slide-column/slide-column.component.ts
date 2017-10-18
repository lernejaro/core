import {
    Component, OnInit, ElementRef, Input,
    ViewEncapsulation, HostBinding
} from '@angular/core'

@Component({
    selector: 'lrn-slide-column',
    templateUrl: './slide-column.component.html',
    styleUrls: ['./slide-column.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SlideColumnComponent implements OnInit {

    @Input()
    @HostBinding('class.vertical-center')
    public verticalCenter: boolean = true

    constructor(public elementRef: ElementRef) {
    }

    ngOnInit() {
    }

}
