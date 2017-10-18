import {Component} from '@angular/core'
import {format} from '../code/code'

const example = format`
    <lrn-multiple-choice>
      <lrn-question>To be or not to be?</lrn-question>
      <lrn-choice lrnCorrect>To be</lrn-choice>
      <lrn-choice>Not to be</lrn-choice>
    </lrn-multiple-choice>
  `


@Component({
  template: `
    <lrn-error heading="Missing question">
      <p>
        Looks like you've tried to create a multiple-choice quiz component <strong>without
        specifying a question</strong>!
        It's can't be a quiz without a question, right?
      </p>

      <p>
        Worry not: adding a question is <strong>piece of cake</strong>.
        You just need to wrap your question inside <code>{{questionTags}}</code> tags.
      </p>

      <p>
        Check out a complete example below.
      </p>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>

      <lrn-multiple-choice style="font-size: .8em">
        <lrn-question>To be or not to be?</lrn-question>
        <lrn-choice lrnCorrect>To be</lrn-choice>
        <lrn-choice>Not to be</lrn-choice>
      </lrn-multiple-choice>
    </lrn-error>
  `,
})
export class MultipleChoiceNoQuestionErrorComponent {
  questionTags = `<lrn-question></lrn-question>`
  example = example
}


@Component({
  template: `
    <lrn-error heading="Missing correct answer">
      <p>
        Oops... Are you trying to trick your students?!
      </p>

      <p>
        Every question needs <strong>at least one correct answer</strong>.
        The quiz you've provided contains no correct answers.
      </p>

      <p>
        Simply add the <code>lrnCorrect</code> directive to the correct answer.
        Feel free to add multiple correct answer, too!
        Use the example below as a starting point.
      </p>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>

      <lrn-multiple-choice style="font-size: .8em">
        <lrn-question>To be or not to be?</lrn-question>
        <lrn-choice lrnCorrect>To be</lrn-choice>
        <lrn-choice>Not to be</lrn-choice>
      </lrn-multiple-choice>
    </lrn-error>
  `,
})
export class MultipleChoiceNoCorrectAnswerErrorComponent {
  example = example
}


@Component({
  template: `
    <lrn-error heading="Missing choices">
      <p>
        Huh? Is that you idea of <i>multiple</i> choices?
        You haven't given your students even a single one!
      </p>

      <p>
        But it's fine, as it can be easily fixed.
        Just under your question, simply list all the possible answers inside
        <code>&lt;lrn-choice></code>
        tags.
      </p>

      <p>
        Here's some code to help you get started.
      </p>

      <pre><code [lrnCode]="'html'">{{ example }}</code></pre>

      <lrn-multiple-choice style="font-size: .8em">
        <lrn-question>To be or not to be?</lrn-question>
        <lrn-choice lrnCorrect>To be</lrn-choice>
        <lrn-choice>Not to be</lrn-choice>
      </lrn-multiple-choice>
    </lrn-error>
  `,
})
export class MultipleChoiceNoChoicesErrorComponent {
  example = example
}


@Component({
  template: `
    <lrn-error heading="A stray question">
      <p>
        Hmmm. Looks like you're trying to create a question which is not part of a quiz.
      </p>

      <p>
        The <code>&lt;lrn-question></code> component is supposed to be used only
        inside the <code>&lt;multiple-choice></code> component.
      </p>
    </lrn-error>
  `,
})
export class StrayQuestionErrorComponent {
}


@Component({
  template: `
    <lrn-error heading="Conflicting feedback">
      <p>
        Congrats on wanting to help your students by giving immediate feedback
        on their answers!
      </p>

      <p>
        However, it looks like you might've gotten something wrong.
        You've created a multiple-choice question where you've provided
        a <code>[feedback]</code> function to both <code>&lt;lrn-multiple-choice></code>
        component and some of <code>&lt;lrn-choice></code> components.
      </p>

      <p>
        Since these are technically two different functions,
        we can't use both of them.
      </p>
    </lrn-error>
  `,
})
export class ConflictingFeedbackErrorComponent {
}
