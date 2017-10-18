import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {HorizontalComponent} from './horizontal.component'
import {VerticalComponent} from './vertical.component'
import {FullScreenComponent} from './full-screen.directive'
import {CenterComponent} from './center.component'
import {MaximizeComponent} from './maximize.component'

const declarations = [
  HorizontalComponent,
  VerticalComponent,
  FullScreenComponent,
  CenterComponent,
  MaximizeComponent,
]

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: declarations,
  exports: declarations,
})
export class LayoutModule {
}
