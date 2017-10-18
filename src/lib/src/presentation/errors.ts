import {Component} from '@angular/core'
import {format} from '../code/code'


@Component({
  selector: 'lrn-presentation-missing-input-base-error',
  template: `
    <p>
      Here's a list of all stuff that you must provide.
    </p>

    <ul>
      <li><b>title</b> of your presentation</li>
      <li><b>author</b> (that's you!)</li>
      <li><b>email</b> so your students can contact you</li>
    </ul>

    <pre><code [lrnCode]="'html'">{{ example }}</code></pre>
  `,
})
export class PresentationMissingInputBaseErrorComponent {
  example = format`
    <lrn-presentation [title]="'My Awesome Presentation'"
                      [author]="'Chuck Norris'"
                      [email]="'name@example.com'"
    ></lrn-presentation>
  `
}


@Component({
  template: `
    <lrn-error heading="Untitled presentation">
      <p>
        Woah! How 'bout giving your presentation a title?
        Every presentation needs a title slide, but without an actual title,
        it simply can't be generated.
      </p>

      <p>
        Don't worry, it's super-simple to add one.
        Just provide it through a <code>[title]</code> input to
        <code>&lt;lrn-presentation></code> component.
      </p>

      <lrn-presentation-missing-input-base-error></lrn-presentation-missing-input-base-error>
    </lrn-error>
  `,
})
export class UntitledPresentationErrorComponent {
}


@Component({
  template: `
    <lrn-error heading="Missing author's name">
      <p>
        Are you on the run from the police?
      </p>

      <p>
        Unless you actually <i>are</i>, you should tell your students who you are.
        Don't reveal all your darkest secrets; just give them <strong>your name</strong>.
      </p>

      <lrn-presentation-missing-input-base-error></lrn-presentation-missing-input-base-error>
    </lrn-error>
  `,
})
export class PresentationWithoutAuthorErrorComponent {
}


@Component({
  template: `
    <lrn-error heading="Missing email address">
      <p>
        Your students will not send an owl to your house with a letter describing their problems.
        They will want to send you an email.
      </p>

      <p>
        Go ahead and tell your users how they can contact you.
      </p>

      <p>
        This information will also be used for generating some slides, such as
        the title slide and the thank-you slide.
      </p>

      <lrn-presentation-missing-input-base-error></lrn-presentation-missing-input-base-error>
    </lrn-error>
  `,
})
export class PresentationWithoutEmailErrorComponent {
}


@Component({
  template: `
    <lrn-warning heading="No Sections Found"
                 suppress="suppressNoSectionsFoundWarning"
    >
      <p>
        You've created a presentation “{{ title }}” without any sections.
        You should <b>break it up into sections</b> so it's easier to digest.
        It also helps students always know what's the current sub-topic of
        your presentation.
      </p>

      <p>
        Use an input <code>[section]</code> on the <code>&lt;lrn-slide></code>
        component to start a section.
      </p>

      <p>
        The section will automatically end on the next slide which you
        explicitly provide a section to.
      </p>
    </lrn-warning>
  `,
})
export class PresentationNoSectionsFoundWarningComponent {
  public title: string
}


@Component({
  template: `
    <lrn-warning heading="Not Enough Sections"
                 suppress="suppressNotEnoughSectionsWarning"
    >
      <p>
        You've created a presentation “{{title}}” with
        {{numberOfSlides}} slides, but only {{numberOfSections}} sections.
        You might want to create more sections to make it easier to digest!
      </p>
    </lrn-warning>
  `,
})
export class PresentationNotEnoughSectionsWarningComponent {
  public title: string
  public numberOfSlides: number
  public numberOfSections: number
}


@Component({
  template: `
    <lrn-warning heading="Untitled Slide"
                 suppress="suppressUntitledSlideWarning"
    >
      <p>
        Your presentation “{{ presentationTitle }}” contains a slide without a title.
      </p>
    </lrn-warning>
  `,
})
export class UntitledSlideWarningComponent {
  public presentationTitle: string
}


@Component({
  template: `
    <lrn-error heading="Stray Slide Detected">
      <p>
        I'm confused.
      </p>

      <p>
        You've created a slide component but it's <strong>not inside a presentation</strong>.
        Slides only make sense if they're a part of a presentation.
        {{ title ? ('The slide in question is titled “' + title + '“') : '' }}
      </p>

      <p>
        Make sure you follow the following structure.
      </p>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>
    </lrn-error>
  `,
})
export class StraySlideErrorComponent {
  public title: string
  example = format`
    <lrn-presentation>
      <lrn-slide></lrn-slide>
      <lrn-slide></lrn-slide>
      <lrn-slide></lrn-slide>
    </lrn-presentation>
  `
}
