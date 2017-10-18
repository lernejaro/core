import {Component, EventEmitter, Input, OnInit, Optional, Output} from '@angular/core'
import {RadioButtonGroupComponent} from '../radio-button-group/radio-button-group.component'
import {UniqueIdService} from '../../unique-id.service'

@Component({
  selector: 'lrn-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {

  @Input() public value: string = this._uniqueIdService.getUniqueId('radio-button-')
  @Input() public name: string

  @Input() public currentValue: string
  @Output() public currentValueChange = new EventEmitter<string>()

  public get isSelected() {
    return this.value == this.currentValue
  }

  public emitCurrentValueChange() {
    this.currentValueChange.emit(this.currentValue)
    if (this.radioButtonGroup != null) {
      this.radioButtonGroup.value = this.value
    }
  }

  constructor(@Optional() public radioButtonGroup: RadioButtonGroupComponent,
              private _uniqueIdService: UniqueIdService) {
  }

  ngOnInit() {
  }

}
