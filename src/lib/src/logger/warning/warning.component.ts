import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'lrn-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss'],
})
export class WarningComponent implements OnInit {

  @Input() heading: string
  @Input() suppress: string

  constructor() {
  }

  ngOnInit() {
  }

}
