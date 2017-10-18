import {Component, Input, OnInit} from '@angular/core'

@Component({
  selector: 'lrn-questions-slide',
  templateUrl: './questions-slide.component.html',
  styleUrls: ['./questions-slide.component.scss'],
})
export class QuestionsSlideComponent implements OnInit {

  @Input() public author: string
  @Input() public email: string

  constructor() {
  }

  ngOnInit() {
  }

}
