import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {CodeModule} from '../code/code.module'
import {ConsoleModule} from '../console/console.module'
import {KatexModule} from '../katex/katex.module'
import {LatexModule} from '../latex/latex.module'
import {LayoutModule} from '../layout/layout.module'
import {LoggerModule} from '../logger/logger.module'
import {MarkdownModule} from '../markdown/markdown.module'
import {NotebookModule} from '../notebook/notebook.module'
import {PlanimetricsModule} from '../planimetrics/planimetrics.module'
import {PresentationModule} from '../presentation/presentation.module'
import {QuizModule} from '../quiz/quiz.module'
import {UiModule} from '../ui/ui.module'
import {UniqueIdService} from '../unique-id.service'

const REEXPORTS = [
  CommonModule,
  CodeModule,
  ConsoleModule,
  KatexModule,
  LatexModule,
  LayoutModule,
  LoggerModule,
  MarkdownModule,
  NotebookModule,
  PlanimetricsModule,
  PresentationModule,
  QuizModule,
  UiModule,
]

@NgModule({
  imports: REEXPORTS,
  exports: REEXPORTS,
  providers: [
    UniqueIdService,
  ],
})
export class LernejaroModule {
}
