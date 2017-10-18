import {Component} from '@angular/core'
import {format} from '../code/code'

@Component({
  template: `
    <lrn-error heading="Empty title">
      <p>
        A title is not of much help if it's <strong>empty</strong>...
      </p>

      <p>
        Learning is better when it can be done in smaller chunks.
        This is why dividing your lesson into smaller parts is super-important.
        The easiest way to do so is by having headings!
      </p>

      <p>
        The notebook can have only a single <code>&lt;h1></code> heading,
        but can (and <i>should</i>) have multiples headings of lower level.
        These are also used to generate a table of contents.
      </p>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>
    </lrn-error>
  `,
})
export class NotebookTitleWithoutContentErrorComponent {
  example = format`
    <h2>Title</h2>
  `
}


@Component({
  template: `
    <lrn-error heading="No author specified">
      <p>
        Why hide your identity? Tell your students who you are!
      </p>

      <p>
        Include <strong>your name</strong> in the <code>author</code> input.
        You can see how to do that in the example below.
      </p>

      <p style="font-size: .8em; line-height: 2">
        (But please don't write Chuck Norris...
        Unless your name is actually Chuck Norris.)
      </p>

      <pre><code lrnCode="html">{{ example }}</code></pre>
    </lrn-error>
  `,
})
export class NotebookWithoutAuthorErrorComponent {
  example = format`
    <lrn-notebook author="Chuck Norris"
    ></lrn-notebook>
  `
}


@Component({
  template: `
    <lrn-error heading="No language specified">
      <p>
        It might be obvious to the reader <b>what language you're writing in</b>,
        but it will not be obvious to Lernejaro!
      </p>

      <p>
        Some parts of the final notebook which you're currently writing
        will be written by Lernejaro; for instance, the headings for
        <b>auto-generated titles</b> at the end of the document.
      </p>

      <p>
        This is why you need to provide the language. Don't worry,
        it's easy! Just pass in <code>lang</code> as an input,
        in the two-letter form.
      </p>

      <p>
        For example, use <code>en</code> for English and <code>sr</code>
        for Serbian.
      </p>

      <pre><code lrnCode="html">{{ example }}</code></pre>
    </lrn-error>
  `,
})
export class NotebookWithoutLanguageSpecifiedErrorComponent {
  example = format`
    <lrn-notebook lang="sr"
    ></lrn-notebook>
  `
}


@Component({
  template: `
    <lrn-warning heading="No External Resources"
                 suppress="suppressNoExternalResourcesWarning">
      <p>
        Looks like your notebook “{{ this.notebookTitle }}” contains <b>no links</b> to any
        external resources.
      </p>

      <p>
        This might be fine for shorter notebooks, but yours has about
        {{ numberOfWords }} words! It's the right time to start adding some.
      </p>

      <p>
        You should consider adding references to
        webpages where students can <b>read more about the topic you're covering</b>.
        To add a link, wrap it in anchor tags (<code>&lt;a></code>) and optionally
        add a title attrbiute which will be used
        for displaying a list of all references at the bottom of the page. Without a
        title attribute, the text inside the anchor tags will be used for the list of
        references.
      </p>
    </lrn-warning>
  `,
})
export class NoExternalResourcesWarningComponent {
  notebookTitle: string
  numberOfWords: number
}
