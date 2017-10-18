import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core'
import {TreeTableOfContent} from './table-of-content-tree-node.interface'

@Component({
    selector: 'lrn-table-of-content',
    templateUrl: './table-of-content.component.html',
    styleUrls: ['./table-of-content.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TableOfContentComponent implements OnInit {

    @Input() public tree: TreeTableOfContent

    constructor() {
    }

    ngOnInit() {
    }

}
