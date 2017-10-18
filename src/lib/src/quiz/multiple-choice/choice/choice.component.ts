import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core'
import {UniqueIdService} from '../../../unique-id.service'

@Component({
  selector: 'lrn-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss'],
})
export class ChoiceComponent implements OnInit {

  @ViewChild('template', {read: TemplateRef})
  public template: TemplateRef<any>

  @Input() public value: string

  private _correct: boolean = false

  public setAsCorrect() {
    this._correct = true
  }

  public isCorrect(): boolean {
    return this._correct
  }

  @Input() public feedback: string = null

  constructor(uniqueIdService: UniqueIdService) {
    this.value = uniqueIdService.getUniqueId('lrn-choice-radio-button-')
  }

  ngOnInit() {
  }

}
