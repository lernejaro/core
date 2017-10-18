import {Component} from '@angular/core'
import {format} from './code'

@Component({
  template: `
    <lrn-error>
      <p>
        You've created a code snippet using directive <code>lrnCode</code>,
        but you haven't provided the language which you've used.
      </p>

      <p>
        Provide a language by passing a string into the directive.
      </p>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>
    </lrn-error>
  `,
})
export class NoLanguageSpecifiedErrorComponent {
  example = format`
  <pre><code [lrnCode]="'javascript">Your code goes here</code></pre>
  `
}
