import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {SlideComponent} from './slide/slide.component'
import {PresentationComponent} from './presentation.component'
import {SlideColumnComponent} from './slide-column/slide-column.component'
import {TitleSlideComponent} from './title-slide/title-slide.component'
import {UiModule} from '../ui/ui.module'
import {RouterModule} from '@angular/router'
import {QuestionsSlideComponent} from './questions-slide/questions-slide.component'
import {ThankYouSlideComponent} from './thank-you-slide/thank-you-slide.component'
import {SlideControlsComponent} from './slide-controls/slide-controls.component'
import {TableOfContentsComponent} from './table-of-contents/table-of-contents.component'
import {
  PresentationMissingInputBaseErrorComponent,
  PresentationNoSectionsFoundWarningComponent,
  PresentationNotEnoughSectionsWarningComponent,
  PresentationWithoutAuthorErrorComponent,
  PresentationWithoutEmailErrorComponent,
  StraySlideErrorComponent,
  UntitledPresentationErrorComponent,
  UntitledSlideWarningComponent,
} from './errors'
import {CodeModule} from '../code/code.module'
import {LoggerModule} from '../logger/logger.module'

const errorComponents = [
  PresentationWithoutAuthorErrorComponent,
  PresentationWithoutEmailErrorComponent,
  UntitledPresentationErrorComponent,
]

const warningComponents = [
  PresentationNoSectionsFoundWarningComponent,
  PresentationNotEnoughSectionsWarningComponent,
  UntitledSlideWarningComponent,
  StraySlideErrorComponent,
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UiModule,
    CodeModule,
    LoggerModule,
  ],
  declarations: [
    PresentationComponent,
    SlideComponent,
    SlideColumnComponent,
    TitleSlideComponent,
    QuestionsSlideComponent,
    ThankYouSlideComponent,
    SlideControlsComponent,
    TableOfContentsComponent,
    PresentationMissingInputBaseErrorComponent,
    ...errorComponents,
    ...warningComponents,
  ],
  exports: [
    PresentationComponent,
    SlideComponent,
    SlideColumnComponent,
    TitleSlideComponent,
  ],
  entryComponents: [
    TitleSlideComponent,
    TableOfContentsComponent,
    ...errorComponents,
    ...warningComponents,
  ],
})
export class PresentationModule {
}
