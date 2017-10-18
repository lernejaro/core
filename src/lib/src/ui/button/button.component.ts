import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core'

@Component({
  selector: 'button[lrnButton]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {

  @Input('lrnButton')
  @HostBinding('class')
  public style: 'raised' | 'flat' | 'fab' = 'raised'

}
