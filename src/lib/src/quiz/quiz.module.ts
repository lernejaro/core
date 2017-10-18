import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MultipleChoiceComponent} from './multiple-choice/multiple-choice.component'
import {UiModule} from '../ui/ui.module'
import {ChoiceComponent} from './multiple-choice/choice/choice.component'
import {QuestionComponent} from './question/question.component'
import {CorrectDirective} from './multiple-choice/choice/correct.directive'
import {FillInTheBlankComponent} from './fill-in-the-blank/fill-in-the-blank.component'
import {BlankComponent} from './fill-in-the-blank/blank/blank.component'
import {QuizComponent} from './quiz.component'
import {
  ConflictingFeedbackErrorComponent,
  MultipleChoiceNoChoicesErrorComponent,
  MultipleChoiceNoCorrectAnswerErrorComponent,
  MultipleChoiceNoQuestionErrorComponent,
  StrayQuestionErrorComponent
} from './errors'
import {CodeModule} from '../code/code.module'
import {LoggerModule} from '../logger/logger.module'

const errorComponents = [
  MultipleChoiceNoQuestionErrorComponent,
  MultipleChoiceNoCorrectAnswerErrorComponent,
  MultipleChoiceNoChoicesErrorComponent,
  StrayQuestionErrorComponent,
  ConflictingFeedbackErrorComponent,
]

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    CodeModule,
    LoggerModule,
  ],
  declarations: [
    MultipleChoiceComponent,
    ChoiceComponent,
    QuestionComponent,
    CorrectDirective,
    FillInTheBlankComponent,
    BlankComponent,
    QuizComponent,
    ...errorComponents,
  ],
  exports: [
    MultipleChoiceComponent,
    ChoiceComponent,
    QuestionComponent,
    CorrectDirective,
    FillInTheBlankComponent,
    BlankComponent,
    QuizComponent,
  ],
  entryComponents: [
    ...errorComponents,
  ],
})
export class QuizModule {
}
