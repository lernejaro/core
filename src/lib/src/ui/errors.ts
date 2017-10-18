import {Component} from '@angular/core'

// TODO: Add a list of all possible icons

@Component({
  template: `
    <lrn-error heading="Unknown icon">
      <p>
        The value
        <code>{{ icon === null ? 'null' : icon === undefined ? 'undefined' : icon }}</code>
        which you've provided did not match any known icons.
      </p>
    </lrn-error>
  `,
})
export class UnknownIconErrorComponent {

  public icon: string

}
