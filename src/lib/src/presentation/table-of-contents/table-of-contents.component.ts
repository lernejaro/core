import {Component, Input, OnInit} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {last, map, takeWhile, toArray} from 'lodash-es'

export interface TableOfContentsArrayItem {
  slideNumber: number
  sectionName: string
}

@Component({
  selector: 'lrn-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
})
export class TableOfContentsComponent implements OnInit {

  public _tableOfContents: TableOfContentsArrayItem[]
  public currentSectionSlideIndex: number = -1

  @Input()
  public set tableOfContents(value: Map<string, number>) {
    this._tableOfContents = Array.from(value)
      .map(([sectionName, slideNumber]) => ({sectionName, slideNumber}))
  }

  // TODO This belongs to a service for slides... which I don't have (yet)
  public navigateToSlide(slide: number): void {
    this.router.navigate(['.', {slide}], {relativeTo: this.route})
  }

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .distinctUntilKeyChanged('slide')
      .subscribe(({slide}) => {
        this.currentSectionSlideIndex = last(
          takeWhile(
            map(
              toArray(this._tableOfContents),
              ({slideNumber, sectionName}) => slideNumber),
            slideNumber => slide >= slideNumber),
        )
      })
  }

}
