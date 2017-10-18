import {Component, EventEmitter, Input, OnInit, Optional, Output} from '@angular/core'
import {CheckboxGroupComponent} from '../checkbox-group/checkbox-group.component'
import {UniqueIdService} from '../../unique-id.service'

@Component({
  selector: 'lrn-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {

  @Input() public name: string = this.uniqueIdService.getUniqueId(`checkbox-name-`)
  @Input() public value: string = this.uniqueIdService.getUniqueId(`checkbox-value-`)

  @Input() public currentValue: boolean
  @Output() public currentValueChange = new EventEmitter<boolean>()

  public emitCurrentValueChange(event) {
    this.currentValueChange.emit(event)
    if (this.checkboxGroup != null) {
      this.checkboxGroup.toggleValue(this.value)
    }
  }

  constructor(@Optional() public checkboxGroup: CheckboxGroupComponent,
              private uniqueIdService: UniqueIdService) {
  }

  ngOnInit() {
  }

}
