// tslint:disable-next-line
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core'
import {ChoiceComponent} from './choice/choice.component'
import {shuffle} from 'lodash-es'
import {UniqueIdService} from '../../unique-id.service'
import {LoggerService} from '../../logger/logger.service'
import {QuestionComponent} from '../question/question.component'
import {MultipleChoiceInfo} from './interfaces'
import {
  ConflictingFeedbackErrorComponent,
  MultipleChoiceNoChoicesErrorComponent,
  MultipleChoiceNoCorrectAnswerErrorComponent,
  MultipleChoiceNoQuestionErrorComponent,
} from '../errors'

@Component({
  selector: 'lrn-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
})
export class MultipleChoiceComponent implements AfterContentInit, AfterViewInit, OnInit {

  @ContentChildren(ChoiceComponent) public choicesQueryList: QueryList<ChoiceComponent>
  @ContentChild(QuestionComponent) public questionComponent: QuestionComponent

  @Input() public shuffle: boolean = true
  @Input() public formId: string = this._uniqueId.getUniqueId('multiple-choice-')

  // TODO This is the same as in the fill-in-the-blank component
  private submitted: boolean

  public icon: string

  private resetIcon(): void {
    this.icon = 'question'
  }

  private setWrongIcon(): void {
    this.icon = 'times'
  }

  private setCorrectIcon(): void {
    this.icon = 'check'
  }

  private defaultFeedbackFunction = (info: MultipleChoiceInfo) => null
  @Input() feedback: Function = this.defaultFeedbackFunction

  public feedbackString: string

  private resetFeedback(): void {
    this.feedbackString = null
  }

  public hasSingleCorrectAnswer: boolean

  private chosenValue: string
  private chosenValues = new Set<string>()

  private correctChoiceValue: string
  private correctChoiceValues = new Set<string>()

  public choices: { template: TemplateRef<any>, isCorrect: boolean, value: string }[]

  public emit(emitter: EventEmitter<MultipleChoiceInfo>): MultipleChoiceInfo {
    if (this.hasSingleCorrectAnswer) {
      const answer = this.chosenValue
      const correct = this.correctChoiceValue == answer
      const info = {answer, correct}
      emitter.emit(info)
      return info
    } else {
      const answers = Array.from(this.chosenValues)
      const additional: string[] = answers
        .filter(value => !this.correctChoiceValues.has(value))
      const missing: string[] = Array.from(this.correctChoiceValues)
        .filter(value => answers.indexOf(value) == -1)
      const correct = additional.length == 0 && missing.length == 0
      const info = {answers, correct, additional, missing}
      emitter.emit(info)
      return info
    }
  }

  public onChoicePick(answer: string | string[]): void {
    if (typeof answer == 'string') {
      this.chosenValue = <string>answer
    } else {
      this.chosenValues = new Set(answer)
    }
    this.emit(this.answerChange)

    if (this.submitted) {
      this.resetFeedback()
      this.resetIcon()
      this.submitted = false
    }
  }

  public onSubmit(event: Event): void {
    event.preventDefault()
    const info = this.emit(this.answerSubmit)
    this.feedbackString = this.feedback(info)
    const correct = info.correct
    if (correct) {
      this.setCorrectIcon()
    } else {
      this.setWrongIcon()
    }
    this.submitted = true
  }

  @Output() public answerChange = new EventEmitter<MultipleChoiceInfo>()
  @Output() public answerSubmit = new EventEmitter<MultipleChoiceInfo>()

  constructor(private _uniqueId: UniqueIdService,
              private logger: LoggerService,
              private elementRef: ElementRef) {
  }

  ngAfterContentInit() {
    this.assert()

    this.choices = this.choicesQueryList.map(choiceComponent => {
      return {
        template: choiceComponent.template,
        isCorrect: choiceComponent.isCorrect(),
        value: choiceComponent.value,
      }
    })
    if (this.shuffle) {
      this.choices = shuffle(this.choices)
    }

    const correct = this.choices.filter(choice => choice.isCorrect).map(({value}) => value)
    this.hasSingleCorrectAnswer = correct.length == 1

    if (this.hasSingleCorrectAnswer) {
      this.correctChoiceValue = correct[0]
    } else {
      this.correctChoiceValues = new Set(correct)
    }

    this.tryToConcludeFeedbackFromChildren()
  }

  ngAfterViewInit() {
  }

  private tryToConcludeFeedbackFromChildren() {
    // Can be done only for single answers
    if (!this.hasSingleCorrectAnswer) {
      return
    }

    const existsChoiceWithFeedbackString = this.choicesQueryList.toArray()
      .some(choice => choice.feedback != null)

    if (this.feedback != this.defaultFeedbackFunction && existsChoiceWithFeedbackString) {
      this.logger.display(ConflictingFeedbackErrorComponent)
    }

    this.feedback = ({answer}) => {
      const chosenChoice = this.choicesQueryList.find(choice => choice.value == answer)
      return (chosenChoice && chosenChoice.feedback) || null
    }
  }


  private assert() {
    if (this.questionComponent == null) {
      this.logger.display(MultipleChoiceNoQuestionErrorComponent)
      return
    }

    if (this.choicesQueryList.length == 0) {
      this.logger.display(MultipleChoiceNoChoicesErrorComponent)
      return
    }

    if (!this.choicesQueryList.some(choice => choice.isCorrect())) {
      this.logger.display(MultipleChoiceNoCorrectAnswerErrorComponent)
      return
    }
  }

  ngOnInit() {
    this.resetIcon()
    this.resetFeedback()
  }

}
