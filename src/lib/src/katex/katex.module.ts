import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {KatexComponent} from './katex.component'
import {KatexService} from './katex.service'
import {BMatrixPipe} from './pipes/matrix-b.pipe'
import {VMatrixPipe} from './pipes/matrix-v.pipe'
import {LoggerModule} from '../logger/logger.module'
import {KatexMissingMathErrorComponent} from './errors'

const errors = [
  KatexMissingMathErrorComponent,
]

/**
 * A simple module which enables using LaTeX inside written materials.
 * Exports a single component, `KatexComponent`.
 *
 * It also exports a transformer service which has some utilities for
 * quicker writing some common LaTeX constructions. The transformers
 * also come as pipes.
 */
@NgModule({
  imports: [
    CommonModule,
    LoggerModule,
  ],
  declarations: [
    KatexComponent,
    BMatrixPipe,
    VMatrixPipe,
    ...errors,
  ],
  providers: [
    KatexService,
  ],
  exports: [
    KatexComponent,
    BMatrixPipe,
    VMatrixPipe,
  ],
  entryComponents: [
    ...errors,
  ],
})
export class KatexModule {
}
