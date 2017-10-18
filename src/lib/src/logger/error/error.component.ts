import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'lrn-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {

  @Input() heading: string = 'Lernejaro error'

  constructor() {
  }

  ngOnInit() {
  }

}
