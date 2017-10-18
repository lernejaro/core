import {Component} from '@angular/core'

@Component({
  selector: 'lrn-vertical,[lrnVertical]',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }

    :host > ::ng-deep * + * {
      margin-top: 1rem;
    }
  `],
})
export class VerticalComponent {

}
