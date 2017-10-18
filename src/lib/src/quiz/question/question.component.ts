import {Component, forwardRef, Inject, OnInit, Optional} from '@angular/core'
import {MultipleChoiceComponent} from '../multiple-choice/multiple-choice.component'
import {LoggerService} from '../../logger/logger.service'
import {StrayQuestionErrorComponent} from '../errors'

@Component({
  selector: 'lrn-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {

  constructor(@Inject(forwardRef(() => MultipleChoiceComponent))
              @Optional() private multipleChoiceComponent: MultipleChoiceComponent,
              logger: LoggerService) {
    if (multipleChoiceComponent == null) {
      logger.display(StrayQuestionErrorComponent)
    }
  }

  ngOnInit() {
  }

}
