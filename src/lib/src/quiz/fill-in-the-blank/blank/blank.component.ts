import {Component, forwardRef, Inject, Input, OnInit} from '@angular/core'
import {FillInTheBlankComponent} from '../fill-in-the-blank.component'
import {UniqueIdService} from '../../../unique-id.service'
import {AnswerInfo, AnswerInfoFeedback} from '../answer-info'

@Component({
  selector: 'lrn-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss'],
})
export class BlankComponent implements OnInit {

  private _isCorrectAnswer: (answer: string) => boolean

  @Input()
  public set correct(newValue: string | string[] | ((answer: string) => boolean) | RegExp) {
    if (Array.isArray(newValue)) {
      this._isCorrectAnswer = (answer: string) => newValue.indexOf(answer) > -1
    } else if (typeof newValue == 'function') {
      this._isCorrectAnswer = newValue
    } else if (typeof newValue == 'object') {
      this._isCorrectAnswer = (answer: string) => !!newValue.exec(answer)
    } else {
      this._isCorrectAnswer = (answer: string) => newValue === answer
    }
  }

  @Input() public hint: string = 'Type your answer'

  @Input() public name: string

  @Input() public width: number = 8

  @Input() public feedback: AnswerInfoFeedback =
    (isCorrect: boolean, givenAnswer: string) => {
      if (isCorrect) {
        return `That's right! "${givenAnswer}" is the correct answer.`
      } else {
        return `Nope! "${givenAnswer}" isn't right. Try again.`
      }
    }

  public answer: string

  public answerInfo: AnswerInfo = null

  public onValueChange(answer: string): void {
    this.updateAnswerInfo(answer)
    this._fillInTheBlankComponent.emitChange()
  }

  public updateAnswerInfo(answer: string): void {
    const correct = this._isCorrectAnswer(answer)
    this.answerInfo = {
      answer,
      name: this.name,
      correct,
      hint: this.hint,
      feedback: this.feedback(correct, answer),
    }
  }

  constructor(@Inject(forwardRef(() => FillInTheBlankComponent))
              private _fillInTheBlankComponent: FillInTheBlankComponent,
              private _uniqueId: UniqueIdService) {
  }

  ngOnInit() {
    if (!this.name) {
      this.name = this._uniqueId.getUniqueId('lrn-blank')
    }
    this.updateAnswerInfo('')
  }

}
