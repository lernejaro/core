import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {ErrorComponent} from './error/error.component'
import {WarningComponent} from './warning/warning.component'
import {LoggerService} from './logger.service'

/**
 * A module which is responsible for showing error messages to the
 * content creator as soon as possible, in a friendly format with
 * suggestions.
 *
 * It also shows warnings to help guide the content creator create
 * better content.
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ErrorComponent,
    WarningComponent,
  ],
  exports: [
    ErrorComponent,
    WarningComponent,
  ],
  providers: [
    LoggerService,
  ],
})
export class LoggerModule {
}
