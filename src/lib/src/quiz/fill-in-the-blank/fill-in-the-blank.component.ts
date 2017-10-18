// tslint:disable-next-line
import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core'
import {UniqueIdService} from '../../unique-id.service'
import {BlankComponent} from './blank/blank.component'
import {AnswerInfo} from './answer-info'

@Component({
  selector: 'lrn-fill-in-the-blank',
  templateUrl: './fill-in-the-blank.component.html',
  styleUrls: ['./fill-in-the-blank.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FillInTheBlankComponent implements OnInit, AfterContentInit {

  @Input() public header: string = 'Fill in the blank'

  @Input() public formId: string = this.formId = this.uniqueId.getUniqueId('fill-in-the-blank')

  @Output() public answerChange = new EventEmitter<AnswerInfo[]>()
  @Output() public answerSubmit = new EventEmitter<AnswerInfo[]>()

  @Output() public correctSubmit = new EventEmitter<AnswerInfo[]>()
  @Output() public correctChange = new EventEmitter<AnswerInfo[]>()

  @Output() public wrongSubmit = new EventEmitter<AnswerInfo[]>()
  @Output() public wrongChange = new EventEmitter<AnswerInfo[]>()

  @ContentChildren(BlankComponent) public blanks: QueryList<BlankComponent>

  private submitted: boolean = false


  public icon: string

  private resetIcon(): void {
    this.icon = 'question'
  }

  private setCorrectIcon(): void {
    this.icon = 'check'
  }

  private setWrongIcon(): void {
    this.icon = 'times'
  }


  public feedbackStrings: string[]

  // TODO better name FilInTheBlankAnswerInfo
  private setFeedback(answerInfos: AnswerInfo[]): void {
    this.feedbackStrings = answerInfos.map(({feedback}) => feedback)
  }

  private resetFeedback() {
    this.feedbackStrings = []
  }

  public displayedFeedback: string = ''

  public emitChange(): void {
    const answerInfos: AnswerInfo[] = this.blanks.map(cmp => cmp.answerInfo)
    this.answerChange.emit(answerInfos)
    const allCorrect = answerInfos.every(info => info.correct)
    if (allCorrect) {
      this.changeCorrect(answerInfos)
    } else {
      this.changeWrong(answerInfos)
    }
    if (this.submitted) {
      this.resetFeedback()
      this.resetIcon()
      this.submitted = false
    }
  }

  public emitSubmit(event: Event): void {
    event.preventDefault()
    const answerInfos: AnswerInfo[] = this.blanks.map(cmp => cmp.answerInfo)
    this.answerSubmit.emit(answerInfos)
    const allCorrect = answerInfos.every(info => info.correct)
    if (allCorrect) {
      this.submitCorrect(answerInfos)
      this.setCorrectIcon()
    } else {
      this.submitWrong(answerInfos)
      this.setWrongIcon()
    }
    this.setFeedback(answerInfos)
    this.submitted = true
  }

  public submitCorrect(answerInfos: AnswerInfo[]): void {
    this.correctSubmit.emit(answerInfos)
  }

  public submitWrong(answerInfos: AnswerInfo[]): void {
    this.wrongSubmit.emit(answerInfos)
  }

  public changeCorrect(answerInfos: AnswerInfo[]): void {
    this.correctChange.emit(answerInfos)
  }

  public changeWrong(answerInfos: AnswerInfo[]): void {
    this.wrongChange.emit(answerInfos)
  }

  constructor(private uniqueId: UniqueIdService) {
  }

  ngOnInit() {
    this.resetIcon()
    this.resetFeedback()
  }

  ngAfterContentInit() {
  }

}
