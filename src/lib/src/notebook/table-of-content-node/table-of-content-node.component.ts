import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core'
import {TreeNodeTableOfContent} from '../table-of-content/table-of-content-tree-node.interface'

@Component({
  selector: '[lrnTableOfContentNode]',
  template: `
    <span>
      <button (click)="goTo('#' + node.getData().id)">
        {{node.getData().title}}
      </button>
    </span>

    <ol>
      <li lrnTableOfContentNode *ngFor="let child of node.getChildren()" [node]="child"></li>
    </ol>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class TableOfContentNodeComponent implements OnInit {

  @Input() node: TreeNodeTableOfContent

  public goTo(anchor) {
    window.location.hash = ''
    window.location.hash = anchor
  }

  constructor() {
  }

  ngOnInit() {
  }

}
