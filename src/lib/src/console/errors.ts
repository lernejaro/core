import {ChangeDetectionStrategy, Component} from '@angular/core'
import {format} from '../code/code'

@Component({
  template: `
    <lrn-error heading="Missing language">
      <lrn-markdown>
        In order to use the console component,
        you need to specify a language.
      </lrn-markdown>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>
    </lrn-error>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleNoLanguageErrorComponent {
  public example = format`
    <lrn-console [language]="'javascript'"
    ></lrn-console>
  `
}

@Component({
  template: `
    <lrn-error heading="Unknown Language">
      <p>
        Looks like you requested a console component
        which understands <b>a language named <code>{{ language }}</code></b>.
      </p>

      <p>
        However, the console currently understands <b>only</b> the following languages:
      </p>

      <ul>
        <li *ngFor="let lng of listOfPossibleLanguages"><code>{{ lng }}</code></li>
      </ul>

      <p>
        Choose a language from the list or provide your own.
      </p>
    </lrn-error>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleUnknownLanguageErrorComponent {
  public language: string
  public listOfPossibleLanguages: string[]
  public example = format`
  
  `
}

@Component({
  template: `
    <lrn-error heading="Clashing Interpreters">
      <p>
        Looks like there are some conflicts in interpreters you're trying to use
        for the console component.
      </p>

      <p>
        Here's a list of languages that console is currently aware of.
      </p>

      <ul>
        <li *ngFor="let lng of listOfPossibleLanguages"><code>{{ lng }}</code></li>
      </ul>

      <p>
        Please remove the duplicates.
      </p>
    </lrn-error>
  `,
})
export class ConsoleClashingInterpretersErrorComponent {
  public listOfPossibleLanguages: string[]
}
