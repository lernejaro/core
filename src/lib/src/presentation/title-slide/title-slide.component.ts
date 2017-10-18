import {Component, Input, TemplateRef, ViewEncapsulation} from '@angular/core'

@Component({
  selector: 'lrn-title-slide',
  templateUrl: './title-slide.component.html',
  styleUrls: ['./title-slide.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TitleSlideComponent {

  @Input() author: string | TemplateRef<any> = 'Unknown Author'
  @Input() description: string | TemplateRef<any>
  @Input() title: string | TemplateRef<any>

  @Input() backgroundImageUrl: string = '' // https://unsplash.it/1080?image=987'

  public typeOf(something: any): string {
    return typeof something
  }

}
