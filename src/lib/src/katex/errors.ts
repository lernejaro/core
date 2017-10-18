import {Component} from '@angular/core'
import {format} from '../code/code'

@Component({
  template: `
    <lrn-error title="Missing math">
      <p>
        Looks like you've created a KaTeX component,
        but failed to provide math to render.
      </p>
      
      <p>
        Not much use of a math-rendering component
        without any math to render, right?
      </p>
      
      <pre><code lrnCode="html">{{ example }}</code></pre>
    </lrn-error>
  `
})
export class KatexMissingMathErrorComponent {
  example = format`
    <lrn-katex math="\sqrt 2"></lrn-katex>
  `
}
