import {Component, OnInit, Input, HostBinding} from '@angular/core'

@Component({
    selector: 'lrn-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

    @HostBinding('style.width') @Input() public width: string = '100%'
    @HostBinding('style.height') @Input() public height: string = '1ex'

    @Input() public total: number = 100
    @Input() public current: number = 0

    constructor() {
    }

    ngOnInit() {
    }

}
