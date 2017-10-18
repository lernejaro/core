import {
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnInit,
  Optional,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core'
import {SlideColumnComponent} from '../slide-column/slide-column.component'
import {LoggerService} from '../../logger/logger.service'
import {StraySlideErrorComponent, UntitledSlideWarningComponent} from '../errors'
import {PresentationComponent} from '../presentation.component'

@Component({
  selector: 'lrn-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SlideComponent implements OnInit {

  @Input() public section: string
  @Input() public title: string = ' '
  @Input() public subtitle: string
  @Input() public logo: string | TemplateRef<any>

  @Input() public suppressUntitledSlideWarning: boolean

  @ContentChildren(SlideColumnComponent)
  public slideColumnComponents: QueryList<SlideColumnComponent>

  public typeOf(something: any): string {
    return typeof something
  }

  constructor(public elementRef: ElementRef,
              public logger: LoggerService,
              @Inject(forwardRef(() => PresentationComponent))
              @Optional() private presentation: PresentationComponent) {
  }

  ngOnInit() {
    this.assert()
  }

  private assert() {
    if (this.presentation == null) {
      const context = {}
      if (this.title != null) {
        context['title'] = this.title
      }
      this.logger.display(StraySlideErrorComponent, context)
      return
    }

    if (
      !this.suppressUntitledSlideWarning &&
      (this.title == null || this.title.trim().length == 0)
    ) {
      this.logger.display(UntitledSlideWarningComponent, {
        presentationTitle: this.presentation.title,
      })
      return
    }
  }

}
