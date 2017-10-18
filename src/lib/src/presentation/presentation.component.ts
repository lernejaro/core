import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
  QueryList,
  Renderer,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import {SlideComponent} from './slide/slide.component'
import {ActivatedRoute, Router} from '@angular/router'
import {PaletteService} from '../ui/palette.service'
import {LoggerService} from '../logger/logger.service'
import {Subject} from 'rxjs/Subject'
import {
  PresentationNoSectionsFoundWarningComponent,
  PresentationNotEnoughSectionsWarningComponent,
  PresentationWithoutAuthorErrorComponent,
  PresentationWithoutEmailErrorComponent,
  UntitledPresentationErrorComponent,
} from './errors'
import 'rxjs/add/operator/distinctUntilChanged'

export interface SlideIdentifier {
  type: string // 'title' | 'user' | 'questions' | 'thank-you'
  index?: number
}

@Component({
  selector: 'lrn-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss'],
})
export class PresentationComponent implements OnInit, AfterContentInit {

  @Input() public suppressNoSectionsFoundWarning: boolean
  @Input() public suppressNotEnoughSectionsWarning: boolean

  @Input() public author: string | TemplateRef<any>
  @Input() public title: string | TemplateRef<any>
  @Input() public logo: string | TemplateRef<any> =
    'https://akimg0.ask.fm/assets/149/346/095/normal/elfaklogo.png'
  @Input() public email: string

  @Input() public withoutTitleSlide: boolean = false
  @Input() public withoutQuestionsSlide: boolean = false
  @Input() public withoutThankYouSlide: boolean = false

  public slideChange$ = new Subject<number>()

  private _currentSlideIndex: number = 0

  public set currentSlideIndex(currentSlideIndex: number) {
    this._currentSlideIndex = currentSlideIndex
    this.slideChange$.next(currentSlideIndex)
    this.currentSlideIdentifier = this.slideIdentifiers[currentSlideIndex]
  };

  public get currentSlideIndex(): number {
    return this._currentSlideIndex
  }

  public get slideIdentifiers(): SlideIdentifier[] {
    return [
      ...(!this.withoutTitleSlide ? [{type: 'title'}] : []),
      ...this.slideComponents.map((_, index) => ({type: 'user', index})),
      ...(!this.withoutQuestionsSlide ? [{type: 'questions'}] : []),
      ...(!this.withoutThankYouSlide ? [{type: 'thank-you'}] : [])
    ]
  }

  private mapGlobalIndexToUserSlideIndex(globalIndex): number {
    if (this.withoutTitleSlide) {
      return globalIndex
    } else {
      return globalIndex - 1
    }
  }

  private _currentSlideIdentifier: SlideIdentifier = null

  public get currentSlideIdentifier(): SlideIdentifier {
    return this._currentSlideIdentifier
  }

  public set currentSlideIdentifier(value: SlideIdentifier) {
    this._currentSlideIdentifier = value
    if (this.slideComponents != null) {
      this.updateView()
    }
  }

  @ViewChild('outlet') public outlet: ElementRef

  @ContentChildren(SlideComponent)
  public slideComponents: QueryList<SlideComponent>

  public tableOfContents = new Map<string, number>()

  private updateView(): void {
    if (this.currentSlideIdentifier == null) {
      return
    }

    const userProvidedSlides = this.slideComponents
      .map(element => element.elementRef.nativeElement)

    // Remove all slides
    this.renderer.detachView(userProvidedSlides)

    // Here we care only for attaching user slides
    if (this.currentSlideIdentifier.type == 'user') {
      // Attach only the current user slide, after the outlet.
      const userSlideIndex = this.mapGlobalIndexToUserSlideIndex(this.currentSlideIndex)
      const currentSlide = userProvidedSlides[userSlideIndex]
      this.renderer.attachViewAfter(this.outlet.nativeElement, [currentSlide])
    }

    // Update route
    // TODO: What if multiple presentations on the same screen?
    const slide = this.currentSlideIndex + 1
    if (this.route && this.router) {
      this.router.navigate(['.', {slide}], {relativeTo: this.route})
    }
  }

  public isFirstSlide(): boolean {
    return this.currentSlideIndex == 0
  }

  public isLastSlide(): boolean {
    return this.currentSlideIndex == this.slideIdentifiers.length - 1
  }

  public goToFirstSlide(): void {
    this.currentSlideIndex = 0
  }

  public goToLastSlide(): void {
    this.currentSlideIndex = this.slideIdentifiers.length - 1
  }

  public goToNext(): void {
    if (!this.isLastSlide()) {
      this.currentSlideIndex++
    }
  }

  public goToPrevious(): void {
    if (!this.isFirstSlide()) {
      this.currentSlideIndex--
    }
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
    if (event.target != document.body) {
      return
    }
    switch (event.code) {
      case 'End':
        this.goToLastSlide()
        break
      case 'KeyJ':
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case 'Space':
        this.goToNext()
        break
      case 'KeyK':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        this.goToPrevious()
        break
      case 'Home':
        this.goToFirstSlide()
        break
    }
  }

  constructor(private renderer: Renderer,
              @Optional() private route: ActivatedRoute,
              @Optional() private router: Router,
              private palette: PaletteService,
              private logger: LoggerService) {
  }

  ngOnInit() {
    if (this.title == null) {
      this.logger.display(UntitledPresentationErrorComponent)
      return
    }

    if (this.author == null) {
      this.logger.display(PresentationWithoutAuthorErrorComponent)
      return
    }

    if (this.email == null) {
      this.logger.display(PresentationWithoutEmailErrorComponent)
      return
    }
  }

  ngAfterContentInit() {
    this.currentSlideIdentifier = this.slideIdentifiers[0]

    // Navigate to correct slide based on route
    if (this.route) {
      this.route.params
        .distinctUntilKeyChanged('slide')
        .subscribe(params => {
          const slideIndex = +params['slide'] - 1
          const cond1 = slideIndex != null
          const cond2 = !isNaN(slideIndex) && slideIndex < this.slideIdentifiers.length
          if (cond1 && cond2) {
            this.currentSlideIndex = slideIndex
          } else {
            this.goToFirstSlide()
          }
        })
    }

    // Set logo to all slides
    // Set sections based on first mention of the section in a row
    // Create a Map to be used for generating ToC
    let numberOfSections = 0
    let previousSectionName = null
    this.slideComponents.forEach((slide, index) => {
      slide.logo = this.logo

      if (slide.section != null) {
        previousSectionName = slide.section
        numberOfSections++
        this.tableOfContents.set(slide.section, index + 1 + (!this.withoutTitleSlide ? 1 : 0))
      }
      slide.section = previousSectionName
    })

    // Warn user if no sections at all, or not enough sections
    if (numberOfSections == 0 && !this.suppressNoSectionsFoundWarning) {
      this.logger.display(PresentationNoSectionsFoundWarningComponent, {
        title: this.title,
      })
      return
    }

    if (this.slideIdentifiers.length / numberOfSections > 30 &&
      !this.suppressNotEnoughSectionsWarning) {
      this.logger.display(PresentationNotEnoughSectionsWarningComponent, {
        title: this.title,
        numberOfSlides: this.slideIdentifiers.length,
        numberOfSections,
      })
      return
    }
  }

}
