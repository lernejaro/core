import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core'
import * as prismjs from 'prismjs'
import {LoggerService} from '../logger/logger.service'
import {PresentationComponent} from '../presentation/presentation.component'
import {NoLanguageSpecifiedErrorComponent} from './errors'

/**
 * A component for using code snippets. Works for both inline snippets and
 * code blocks.
 *
 * ### Usage
 *
 * For inline snippet, use the HTML5 `<code>` tag and place a directive
 * `lrnCode` on it. The input with the same name expects that you pass in
 * a string for the language which you are writing.
 *
 * Not specifying the language will trigger the **No language specified**
 * error.
 *
 * ```html
 * This is <code lrnCode=javascript>inline</code> code example.
 * ```
 *
 * For code blocks, it's technically the same syntax. You just need to
 * wrap everything inside a `<pre>` tag.
 *
 * ```html
 * <pre><code lrnCode=html>Code snippet goes here</code></pre>
 * ```
 *
 * Given the nature of `<pre>` tag, which preserves whitespace, it's not
 * comfortable to write code inside HTML. Given the way a human would
 * want to organize the code with indentation, a machine would interpret
 * it too literally. There would be empty lines and the indentation would
 * be expanded on every line.
 *
 * Because of this, the `format` template literal tag is provided. It's
 * recommended to use it: write your code inside the class definition
 * and then use Angular's interpolation syntax to print it.
 *
 * ```typescript
 * public code = format`
 *   some(pretty) {
 *     code()
 *   }
 * ```
 *
 * ```html
 * <pre><code lrnCode=javascript>{{ code }}</code></pre>
 * ```
 */
@Component({
  selector: 'code[lrnCode]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CodeComponent implements AfterViewInit, OnInit {

  /**
   * The language which the snippet is written in.
   */
  @Input('lrnCode') public language: string

  constructor(private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private logger: LoggerService,
              // We must re-render on slide changes in presentation component
              @Optional() private presentation: PresentationComponent) {
    this.changeDetectorRef.detach()
  }

  private render() {
    const element = this.elementRef.nativeElement
    element.classList.add(`language-${this.language}`)
    prismjs.highlightElement(element, false)
  }

  ngOnInit() {
    if (this.language == null) {
      this.logger.display(NoLanguageSpecifiedErrorComponent)
    }
  }

  ngAfterViewInit() {
    this.render()
    if (this.presentation != null) {
      this.presentation.slideChange$.subscribe(() => this.render())
    }
  }

}
