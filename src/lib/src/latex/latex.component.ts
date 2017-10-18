import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core'

@Component({
  template: `<textarea #textarea [value]="code"></textarea>`,
  styles: [`
    :host {
      display: block;
      width: calc(100vw - 2em);
      height: 70vh;
    }

    textarea {
      width: calc(100vw - 2em);
      height: 70vh;
    }
  `],
})
export class LatexComponent implements AfterViewInit {
  public code: string

  @ViewChild('textarea')
  public textarea: ElementRef

  public ngAfterViewInit(): void {
    const textarea = this.textarea.nativeElement as HTMLTextAreaElement
    textarea.focus()
    textarea.select()
  }
}
