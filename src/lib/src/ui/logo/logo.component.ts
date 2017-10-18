import {Component, OnInit} from '@angular/core'

@Component({
    selector: 'lrn-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit {

    public size: number = 100
    public cardSize: number = 60

    public margin: number = (this.size - this.cardSize) / 2

    constructor() {
    }

    ngOnInit() {
    }

}
