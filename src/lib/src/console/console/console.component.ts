import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/scan'
import 'rxjs/add/operator/withLatestFrom'
import {
  ConsoleClashingInterpretersErrorComponent,
  ConsoleNoLanguageErrorComponent,
  ConsoleUnknownLanguageErrorComponent,
} from '../errors'
import {LRN_CONSOLE_INTERPRETER} from '../console'
import {Interpreter} from '../interpreter.interface'
import {uniq} from 'lodash-es'
import {ModalService} from '@lernejaro/modal'

/**
 * A component which represents a basic console applicative interface
 * which the student can use to try out a language. It accepts a single
 * input, `language`, which instructs the component which interpreter
 * to use. By default, the following two languages are supported:
 *
 * - JavaScript (`javascript`) and
 * - a very basic subset of Lisp (`lisp`).
 *
 * ### Usage
 *
 * The basic usage is simple: just add a tag `lrn-console` and provide
 * a mandatory input `language`. This string should target one of the
 * currently available languages.
 *
 * ```html
 * <lrn-console language=javascript></lrn-console>
 * ```
 *
 * If you provide a language which is not known to the component,
 * an error is shown where you can see a list of all supported languages.
 *
 *
 *
 * ### Creating a Custom Interpreter
 *
 * The component itself does not take any action in interpreting the
 * user's input. This functionality is delegated to a service which is
 * chosen by the string provided though the `language` input to the
 * component instance.
 *
 * You can create your own interpreters by implementing the `Interpreter`
 * interface.
 *
 * You need to specify a `language` string which will serve as an
 * indemnification token for the interpreter when instantiating a
 * component.
 *
 * And, of course, you need to create an actual function for handling
 * user's input. Its name is `handle` and it accepts string as a single
 * argument. The return value is also a string.
 *
 * Note that interpreters do not need to be actual programming languages.
 * You can use the `ConsoleComponent` for other things as well.
 * Here's an example of an interpreter which reports if the user's
 * input is a palindrome or not.
 *
 * ```typescript
 * export class PalindromeInterpreter implements Interpreter {
 *   language = 'palindrome'
 *
 *   handle(input: string): string {
 *     return input.split('').reverse().join('') == input
 *       ? `${input} jeste palindrom!`
 *       : `${input} nije palindrom!`
 *   }
 * }
 * ```
 *
 * After creating an interpreter, you need to provide it. This can be
 * done either in the NgModule or in a component. Use the
 * `LRN_CONSOLE_INTERPRETERS` token when providing it. Make sure to
 * set the `multi` flag, since there are multiple interpreters during
 * runtime of the application.
 *
 * ```typescript
 * {
 *   provide: LRN_CONSOLE_INTERPRETERS,
 *   useClass: PalindromeInterpreter,
 *   multi: true,
 * }
 * ```
 */
@Component({
  selector: 'lrn-console',
  template: `
    <section *ngFor="let log of log$ | async">{{ log }}</section>
    <section contenteditable="true"
             (keydown)="onSubmit($event)"
             #prompt
    ></section>
  `,
  styleUrls: ['./console.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleComponent implements OnInit {

  /**
   * The language which the interpreter that will be used for the
   * component instance understands. By default, `javascript` and
   * `lisp` are supported.
   *
   * You can create custom interpreters by providing the multi
   * dependency injection token, `LRN_CONSOLE_INTERPRETER`. For more
   * information, see this component's full documentation.
   *
   * If the provided string does not match any language known to the
   * component, an error is shown.
   */
  @Input() public language: string

  /**
   * An event which emits a pair of user's input and the output given
   * by the console.
   */
  @Output() public submit: Observable<{ input: string, output: string }>

  @ViewChild('prompt') public prompt: ElementRef

  public interpreter: Interpreter

  private inputs$ = new Subject<string>()
  private outputs$ = new Subject<string>()

  public log$ = Observable
    .merge(this.inputs$, this.outputs$)
    .scan((acc, curr) => [...acc, curr], [])

  public handle(input: string): string {
    return this.interpreter.handle(input)
  }

  public onSubmit(event: KeyboardEvent) {
    if (event.key == 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()
      event.stopPropagation()
      const input = (event.target as HTMLElement).innerText
      this.inputs$.next(input)
      try {
        const output = this.handle(input)
        this.outputs$.next(output)
      } catch (e) {
        const output = e.toString()
        this.outputs$.next(output)
      }
      // Clear text inside the prompt
      (this.prompt.nativeElement as HTMLElement).innerText = ''
      // Scroll to bottom
      // this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight
      const el = this.elementRef.nativeElement as HTMLElement
      setTimeout(() => el.scrollTop = el.scrollHeight)
    }
  }

  constructor(private elementRef: ElementRef,
              private modal: ModalService,
              @Inject(LRN_CONSOLE_INTERPRETER) private interpreters: Interpreter[]) {
    this.submit = this.inputs$
      .combineLatest(this.outputs$)
      .map(([input, output]) => ({input, output}))
  }

  ngOnInit() {
    if (this.language == null) {
      this.modal.open(ConsoleNoLanguageErrorComponent)
      return
    }

    const listOfPossibleLanguages = this.interpreters.map(({language}) => language)

    if (listOfPossibleLanguages.length != uniq(listOfPossibleLanguages).length) {
      this.modal.open(ConsoleClashingInterpretersErrorComponent, {
        listOfPossibleLanguages,
      })
      return
    }

    this.interpreter = this.interpreters
      .find(({language}) => language == this.language)

    if (this.interpreter == null) {
      this.modal.open(ConsoleUnknownLanguageErrorComponent, {
        language: this.language,
        listOfPossibleLanguages,
      })
      return
    }
  }

}
