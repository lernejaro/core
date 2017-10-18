import {Component, HostBinding, Input} from '@angular/core'

@Component({
  selector: 'lrn-full-screen,[lrnFullScreen]',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100vh;
      /* Can be overwritten with an input */
      background-color: white;
    }
  `],
})
export class FullScreenComponent {
  @Input('lrnFullScreen') @HostBinding('style.background-color')
  public backgroundColor: string = 'white'
}
