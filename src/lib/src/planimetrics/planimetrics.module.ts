import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {PlanimetricsComponent} from './planimetrics.component'
import {RendererService} from './renderer.service'
import {FormsModule} from '@angular/forms'
import {UiModule} from '../ui/ui.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UiModule,
  ],
  declarations: [
    PlanimetricsComponent,
  ],
  exports: [
    PlanimetricsComponent,
  ],
  providers: [
    RendererService,
  ],
})
export class PlanimetricsModule {
}
