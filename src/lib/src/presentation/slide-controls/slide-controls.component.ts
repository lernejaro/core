import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {PalettePickerComponent} from '../../ui/palette-picker/palette-picker.component'
import {ModalService} from '@lernejaro/modal'

@Component({
  selector: 'lrn-slide-controls',
  templateUrl: './slide-controls.component.html',
  styleUrls: ['./slide-controls.component.scss'],
})
export class SlideControlsComponent implements OnInit {

  @Input() public totalNumberOfSlides: number = 1
  @Input() public currentSlide: number = 0
  @Input() public tableOfContents = new Map<string, number>()

  @Output() public first = new EventEmitter<void>()
  @Output() public prev = new EventEmitter<void>()
  @Output() public next = new EventEmitter<void>()
  @Output() public last = new EventEmitter<void>()

  public openPalette() {
    this.modal.open(PalettePickerComponent)
  }

  constructor(public modal: ModalService) {
  }

  ngOnInit() {
  }

}
