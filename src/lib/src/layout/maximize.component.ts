import {Component} from '@angular/core'

@Component({
  selector: 'lrn-maximize,[lrnMaximize]',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
    }
  `],
})
export class MaximizeComponent {
}
