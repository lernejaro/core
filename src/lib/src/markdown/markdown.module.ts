import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MarkdownComponent} from './markdown.component'
import {MarkdownParserService} from './markdown-parser.service'

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MarkdownComponent,
  ],
  exports: [
    MarkdownComponent,
  ],
  providers: [
    MarkdownParserService,
  ],
})
export class MarkdownModule {
}
