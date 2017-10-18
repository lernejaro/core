import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LatexService} from './latex.service'
import {LatexComponent} from './latex.component'

/**
 * A module which provides a service for rendering articles as Latex documents.
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    LatexComponent,
  ],
  providers: [
    LatexService,
  ],
  entryComponents: [
    LatexComponent,
  ],
})
export class LatexModule {
}
