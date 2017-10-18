import {Component} from '@angular/core'

@Component({
  selector: 'lrn-horizontal,[lrnHorizontal]',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
    }

    :host > ::ng-deep * + * {
      margin-left: 1rem;
    }
  `],
})
export class HorizontalComponent {
}
