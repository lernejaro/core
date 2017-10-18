import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {AppComponent} from './app.component'
import {UiModule} from './ui/ui.module'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {IntroductionComponent} from './introduction/introduction.component'
import {LernejaroModule} from './lernejaro/lernejaro.module'
import {RouterModule} from '@angular/router'

@NgModule({
  declarations: [
    AppComponent,
    IntroductionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    UiModule.forRoot({theme: 'light', color: 'indigo'}),
    LernejaroModule,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
