import {Component} from '@angular/core'

@Component({
  selector: 'lrn-center,[lrnCenter]',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
  `],
})
export class CenterComponent {
}
