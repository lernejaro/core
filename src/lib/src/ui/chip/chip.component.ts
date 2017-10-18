import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'lrn-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {

  public klass: string = null

  @Input()
  public set icon(value: string) {
    if (value == null) {
      this.klass = null
    } else {
      this.klass = `fa fa-${value}`
    }
  }

  constructor() {
  }

  ngOnInit() {
  }

}
