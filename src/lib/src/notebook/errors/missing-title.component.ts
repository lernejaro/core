import {Component} from '@angular/core'
import {format} from '../../code/code'

@Component({
  template: `
    <lrn-error [heading]="'Missing title'">
      <p>
        Looks like your notebook is missing a title!
        Every notebook needs to have it, because it's important for reader to know
        what <b>topic</b> they're reading about.
      </p>

      <p>
        A title is given to the document by simply including an <code>h1</code> tag anywhere
        inside.
      </p>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>
    </lrn-error>
  `,
  styles: [`:host { display: block }`],
})
export class MissingTitleComponent {
  public example = format`
  <lrn-notebook>
    <h1>The title goes here</h1>
  </lrn-notebook>
  `
}
