import {Component, HostBinding} from '@angular/core'
import {animate, keyframes, style, transition, trigger} from '@angular/animations'

@Component({
  selector: 'lrn-modal',
  template: `
    <lrn-card>
      <ng-content></ng-content>
    </lrn-card>
  `,
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('showHide', [
      transition('void => *', [
        animate(200, keyframes([
          style({opacity: 0, transform: 'scale(.9)', offset: 0}),
          style({opacity: 1, transform: 'scale(1.03)', offset: 0.66}),
          style({opacity: 1, transform: 'scale(1)', offset: 1.0}),
        ])),
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'scale(1)', offset: 0}),
          style({opacity: 1, transform: 'scale(1.1)', offset: 0.4}),
          style({opacity: 0, transform: 'scale(.7)', offset: 1.0}),
        ])),
      ]),
    ]),
  ],
})
export class ModalComponent {

  @HostBinding('@showHide') public showHide = 'show'

}
