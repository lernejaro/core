import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {CodeComponent} from './code.component'
import {LoggerModule} from '../logger/logger.module'
import {NoLanguageSpecifiedErrorComponent} from './errors'

const errors = [
  NoLanguageSpecifiedErrorComponent,
]

/**
 * The module which exports a single `CodeComponent`.
 */
@NgModule({
  imports: [
    CommonModule,
    LoggerModule,
  ],
  declarations: [
    CodeComponent,
    ...errors,
  ],
  exports: [
    CodeComponent,
  ],
  entryComponents: [
    ...errors,
  ],
})
export class CodeModule {
}
